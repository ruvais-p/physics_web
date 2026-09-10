CREATE INDEX "Notification_isActive_date_idx"
ON "Notification"("isActive", "date" DESC);

CREATE INDEX "ResearchLab_createdAt_idx"
ON "ResearchLab"("createdAt" DESC);

CREATE INDEX "Facility_createdAt_idx"
ON "Facility"("createdAt" DESC);

CREATE INDEX "Faculty_isActive_sortOrder_createdAt_idx"
ON "Faculty"("isActive", "sortOrder", "createdAt");

CREATE INDEX "FacultyProject_startDate_createdAt_idx"
ON "FacultyProject"("startDate" DESC, "createdAt" DESC);

CREATE INDEX "FacultyPublication_publicationDate_createdAt_idx"
ON "FacultyPublication"("publicationDate" DESC, "createdAt" DESC);

CREATE INDEX "Hero_is_visible_order_createdAt_idx"
ON "Hero"("is_visible", "order", "createdAt");

CREATE INDEX "events_date_idx"
ON "events"("date" DESC);

CREATE INDEX "event_images_event_id_sort_order_idx"
ON "event_images"("event_id", "sort_order");
