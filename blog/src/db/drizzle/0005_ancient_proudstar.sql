ALTER TABLE `Users` MODIFY COLUMN `auth_id` varchar(100) DEFAULT '132390526974949326848';--> statement-breakpoint
CREATE INDEX `idx_analytics_session` ON `PostViewAnalytics` (`post_id`,`created_at`,`session_id`);--> statement-breakpoint
CREATE INDEX `idx_post_views_session` ON `PostViews` (`post_id`,`user_id`,`viewed_at`);