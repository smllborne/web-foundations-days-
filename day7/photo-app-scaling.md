# SnapShare - Scaling Plan

## Assumptions

- 10,000,000 registered users, with 10% active daily, gives 1,000,000 daily active users (DAU).
- Each active user uploads one photo and views 50 feed pages per day.
- Each original photo is 2 MB and each generated thumbnail is 50 KB (0.05 MB).
- Use 1 day ≈ 100,000 seconds for the per-second estimates, and a 5× multiplier for peak traffic.
- Storage estimates include one copy of each original and thumbnail, with no compression, replication, or deletion; MB and TB use decimal units.

## Estimates

- **Uploads:** 1,000,000 per day ÷ 100,000 seconds ≈ **10 uploads/second**; peak ≈ **50 uploads/second**.
- **Feed views:** 1,000,000 × 50 = 50,000,000 per day; ÷ 100,000 seconds ≈ **500 feed views/second**; peak ≈ **2,500 feed views/second**.
- **Storage:** 1,000,000 photos × (2 MB + 0.05 MB) ≈ **2 TB/day**, or about **750 TB/year** (2.05 TB × 365 ≈ 748 TB).

## Read-heavy or write-heavy?

SnapShare is **very read-heavy**: it has about 50 feed views for every photo upload, before counting the many image requests made by each feed page. The large volume of photo files also makes storage cost and scale important design concerns.

## Where do the photos go?

Photo files belong in object storage, not the database: hundreds of terabytes of binary files would make the database large, slow, and expensive to back up. Object storage is designed for durable, cost-effective storage of large files. The database stores structured metadata such as photo ID, owner, caption, timestamp, and object-storage keys or URLs.

## Architecture

```text
 Users (browser / mobile app)
       | API calls                           | photo and thumbnail requests
       v                                     v
 +----------------+                    +-----------+
 | Load balancer  |                    | CDN       |
 +-------+--------+                    +-----+-----+
         |                                   | cache miss
         v                                   v
 +-------+--------+                    +-----+-------------+
 | App servers    |------------------->| Object storage    |
 +--+----------+--+  upload original   | originals +      |
    |          |                       | thumbnails       |
    |          +--> Cache (feed data)  +---------+---------+
    |                                            ^
    +--> Primary database                        | save thumbnail
             |                                   |
             +--> Read replica              +---+----------------+
                  (feed queries)             | Thumbnail worker  |
                                             +---^----------------+
                                                 |
                                          +------+-------+
                                          | Queue        |
                                          +------+-------+
                                                 ^
                                                 |
                                   App servers enqueue job
```

### What each component solves

- **CDN:** Serves photos and thumbnails from locations near users, reducing image latency and load on the object-storage origin.
- **Load balancer:** Distributes API traffic across healthy app servers and removes failed servers from rotation.
- **App servers:** Authenticate requests, handle uploads, assemble feeds, and coordinate work across the cache, database, storage, and queue.
- **Cache:** Keeps prepared feeds and hot metadata in memory so repeated feed reads avoid querying the database.
- **Primary database:** Stores authoritative user, follow, and photo metadata and accepts metadata writes.
- **Read replica:** Handles feed and other read queries, protecting the primary from the read-heavy workload.
- **Object storage:** Holds original photo files and generated thumbnails durably and separately from the database.
- **Thumbnail queue:** Buffers thumbnail jobs so image processing does not block the upload request.
- **Thumbnail worker:** Consumes queued jobs, creates each 50 KB thumbnail, and saves it to object storage.

## Photo upload flow

1. The user sends a photo upload request; the load balancer routes it to a healthy app server.
2. The app server checks the user's authentication token and validates the file type and size.
3. The app server saves the original file to object storage under a unique key.
4. It inserts the photo metadata and processing status into the primary database.
5. It enqueues a job with the photo ID and storage key, then responds to the user without waiting for thumbnail generation.
6. A thumbnail worker consumes the job, reads the original from object storage, creates the 50 KB thumbnail, and saves it back to object storage.
7. The worker updates the photo's metadata with the thumbnail key and ready status; the CDN can serve it on request. Feed data can be refreshed or invalidated so the photo appears for followers.

## Trade-offs

- **Speed vs. feed freshness:** Cached feeds greatly reduce database load, but followers may wait a few seconds to see a new photo; expire or invalidate cached feeds to limit staleness.
- **Cost vs. control:** CDN and object storage charge for storage and transfer, but are typically more cost-effective and durable than serving hundreds of terabytes from application servers.
- **Operational simplicity vs. reliability:** Keeping files in object storage separates them from metadata, but the app must handle partial failures, retry jobs, and clean up unreferenced files.

### Eventual consistency vs. immediate thumbnail availability

Asynchronous thumbnail generation lets the app confirm an upload as soon as the original and metadata are saved, keeping uploads fast and letting worker capacity scale independently. The trade-off is eventual consistency: the photo can appear before its thumbnail is ready, so the app should show a placeholder or processing state until the worker finishes. Waiting for thumbnail generation before confirming the upload makes the thumbnail immediately available, but slows uploads and couples upload capacity to image-processing time; overloaded workers can delay or fail uploads. For SnapShare, prefer asynchronous generation and make the processing state clear unless immediate thumbnail availability is a stronger product requirement than fast, reliable uploads.