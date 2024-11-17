CREATE TABLE `PostShares` (
	`id` int AUTO_INCREMENT NOT NULL,
	`post_id` int NOT NULL,
	`user_id` varchar(100) NOT NULL,
	`share_type` varchar(50) NOT NULL,
	`share_url` varchar(255),
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `PostShares_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `UserBookmarks` (
	`user_id` varchar(100) NOT NULL,
	`post_id` int NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `UserBookmarks_user_id_post_id_pk` PRIMARY KEY(`user_id`,`post_id`)
);
--> statement-breakpoint
ALTER TABLE `ActivePostViewers` MODIFY COLUMN `user_id` varchar(100);--> statement-breakpoint
ALTER TABLE `PostViewAnalytics` MODIFY COLUMN `user_id` varchar(100);--> statement-breakpoint
ALTER TABLE `PostViews` MODIFY COLUMN `user_id` varchar(100);--> statement-breakpoint
ALTER TABLE `PostReactions` MODIFY COLUMN `user_id` varchar(100) NOT NULL;--> statement-breakpoint
ALTER TABLE `Comments` MODIFY COLUMN `author_id` varchar(100) NOT NULL;--> statement-breakpoint
ALTER TABLE `Posts` MODIFY COLUMN `author_id` varchar(100) NOT NULL;--> statement-breakpoint
ALTER TABLE `Replies` MODIFY COLUMN `author_id` varchar(100) NOT NULL;--> statement-breakpoint
ALTER TABLE `UserSocials` MODIFY COLUMN `user_id` varchar(100) NOT NULL;--> statement-breakpoint
ALTER TABLE `Users` MODIFY COLUMN `auth_id` varchar(100) DEFAULT '131421892263853162496';--> statement-breakpoint
ALTER TABLE `PostReactions` ADD CONSTRAINT `PostReactions_post_id_user_id_reaction_type_id_unique` UNIQUE(`post_id`,`user_id`,`reaction_type_id`);--> statement-breakpoint
ALTER TABLE `NewsLetters` ADD `name` varchar(255);--> statement-breakpoint
ALTER TABLE `NewsLetters` ADD `referrer` varchar(255);