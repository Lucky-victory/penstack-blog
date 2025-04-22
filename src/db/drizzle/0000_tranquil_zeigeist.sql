CREATE TABLE `ContactMessages` (
	`id` varchar(36) NOT NULL,
	`name` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	`message` text NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `ContactMessages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `Medias` (
	`id` varchar(36) NOT NULL,
	`name` varchar(255) NOT NULL,
	`url` text NOT NULL,
	`type` varchar(100) NOT NULL,
	`size` int NOT NULL,
	`mime_type` varchar(100),
	`caption` varchar(255),
	`alt_text` varchar(255),
	`width` int,
	`height` int,
	`folder` varchar(255),
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `Medias_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `EmailEvents` (
	`id` varchar(36) NOT NULL,
	`email_id` varchar(255) NOT NULL,
	`newsletter_id` varchar(36),
	`subscriber_id` varchar(36),
	`event_type` varchar(50) NOT NULL,
	`event_data` json,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `EmailEvents_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `NewsLetterRecipients` (
	`id` varchar(36) NOT NULL,
	`newsletter_id` varchar(36) NOT NULL,
	`subscriber_id` varchar(36) NOT NULL,
	`sent_at` timestamp,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `NewsLetterRecipients_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `NewsLetterSubscribers` (
	`id` varchar(36) NOT NULL,
	`email` varchar(255) NOT NULL,
	`name` varchar(255),
	`status` varchar(255) NOT NULL DEFAULT 'subscribed',
	`verification_status` varchar(255) NOT NULL DEFAULT 'unverified',
	`verification_token` varchar(255),
	`verification_token_expires` timestamp,
	`unsubscribed_at` timestamp,
	`referrer` varchar(500),
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `NewsLetterSubscribers_id` PRIMARY KEY(`id`),
	CONSTRAINT `NewsLetterSubscribers_email_unique` UNIQUE(`email`),
	CONSTRAINT `email_index` UNIQUE(`email`),
	CONSTRAINT `verification_token_index` UNIQUE(`verification_token`),
	CONSTRAINT `status_index` UNIQUE(`status`),
	CONSTRAINT `verification_status_index` UNIQUE(`verification_status`)
);
--> statement-breakpoint
CREATE TABLE `NewsLetters` (
	`id` varchar(36) NOT NULL,
	`content_id` varchar(36) NOT NULL,
	`title` varchar(255) NOT NULL,
	`subject` varchar(255) NOT NULL,
	`preview_text` varchar(255),
	`content` text NOT NULL,
	`status` enum('draft','scheduled','sent','failed') NOT NULL DEFAULT 'draft',
	`scheduled_for` timestamp,
	`sent_at` timestamp,
	`resend_email_id` varchar(255),
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `NewsLetters_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `ActivePostViewers` (
	`id` varchar(36) NOT NULL,
	`post_id` varchar(36) NOT NULL,
	`user_id` varchar(100),
	`session_id` varchar(255) NOT NULL,
	`last_active` timestamp ON UPDATE CURRENT_TIMESTAMP,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `ActivePostViewers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `PostViewAnalytics` (
	`id` varchar(36) NOT NULL,
	`post_id` varchar(36) NOT NULL,
	`user_id` varchar(100),
	`session_id` varchar(255),
	`device_type` varchar(50),
	`browser` varchar(50),
	`os` varchar(50),
	`country` varchar(2),
	`region` varchar(100),
	`city` varchar(100),
	`time_spent` int,
	`scroll_depth` int,
	`entry_point` varchar(255),
	`exit_point` varchar(255),
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `PostViewAnalytics_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `PostViews` (
	`id` varchar(36) NOT NULL,
	`post_id` varchar(36) NOT NULL,
	`user_id` varchar(100),
	`ip_address` varchar(45),
	`user_agent` varchar(255),
	`referrer` varchar(255),
	`viewed_at` timestamp DEFAULT (now()),
	CONSTRAINT `PostViews_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `PostReactions` (
	`id` varchar(36) NOT NULL,
	`post_id` varchar(36) NOT NULL,
	`user_id` varchar(100) NOT NULL,
	`reaction_type_id` int NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `PostReactions_id` PRIMARY KEY(`id`),
	CONSTRAINT `PostReactions_post_id_user_id_reaction_type_id_unique` UNIQUE(`post_id`,`user_id`,`reaction_type_id`)
);
--> statement-breakpoint
CREATE TABLE `PostShares` (
	`id` varchar(36) NOT NULL,
	`post_id` varchar(36) NOT NULL,
	`user_id` varchar(100) NOT NULL,
	`share_type` varchar(50) NOT NULL,
	`share_url` varchar(255),
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `PostShares_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `ReactionTypes` (
	`id` varchar(36) NOT NULL,
	`name` varchar(50) NOT NULL,
	`display_name` varchar(50) NOT NULL,
	`emoji` varchar(10),
	`order` int DEFAULT 0,
	`is_active` boolean DEFAULT true,
	`allow_multiple` boolean DEFAULT true,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `ReactionTypes_id` PRIMARY KEY(`id`),
	CONSTRAINT `ReactionTypes_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `Categories` (
	`id` varchar(36) NOT NULL,
	`name` varchar(100) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `Categories_id` PRIMARY KEY(`id`),
	CONSTRAINT `Categories_slug_unique` UNIQUE(`slug`),
	CONSTRAINT `slug_unique_index` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `Comments` (
	`id` varchar(36) NOT NULL,
	`content` text,
	`status` enum('approved','pending','disapproved','deleted') DEFAULT 'pending',
	`post_id` varchar(36) NOT NULL,
	`author_id` varchar(100) NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `Comments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `PostSeoMeta` (
	`id` varchar(36) NOT NULL,
	`post_id` varchar(36) NOT NULL,
	`title` varchar(150),
	`canonical_url` varchar(255),
	`description` varchar(255),
	CONSTRAINT `PostSeoMeta_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `PostTags` (
	`post_id` varchar(36) NOT NULL,
	`tag_id` varchar(36) NOT NULL,
	CONSTRAINT `post_id_tag_id_unique_index` UNIQUE(`post_id`,`tag_id`)
);
--> statement-breakpoint
CREATE TABLE `Posts` (
	`id` varchar(36) NOT NULL,
	`title` varchar(255),
	`content` longtext,
	`summary` varchar(500),
	`meta_id` varchar(36),
	`post_id` varchar(255) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`status` enum('draft','published','deleted') DEFAULT 'draft',
	`scheduled_at` timestamp,
	`schedule_id` varchar(50),
	`author_id` varchar(100) NOT NULL,
	`visibility` enum('public','private') DEFAULT 'public',
	`category_id` int,
	`is_sticky` boolean DEFAULT false,
	`reading_time` int,
	`allow_comments` boolean DEFAULT false,
	`send_newsletter` boolean DEFAULT true,
	`newsletter_sent_at` timestamp,
	`featured_image_id` int,
	`created_at` timestamp DEFAULT (now()),
	`published_at` timestamp GENERATED ALWAYS AS ((
        CASE 
            WHEN status = 'published' THEN updated_at
            ELSE NULL
        END
    )) STORED,
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `Posts_id` PRIMARY KEY(`id`),
	CONSTRAINT `Posts_post_id_unique` UNIQUE(`post_id`),
	CONSTRAINT `Posts_slug_unique` UNIQUE(`slug`),
	CONSTRAINT `idx_post_id` UNIQUE(`post_id`),
	CONSTRAINT `slug_unique_index` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `Replies` (
	`id` varchar(36) NOT NULL,
	`content` text,
	`status` enum('approved','pending','disapproved','deleted') DEFAULT 'pending',
	`comment_id` varchar(36) NOT NULL,
	`author_id` varchar(100) NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `Replies_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `Tags` (
	`id` varchar(36) NOT NULL,
	`name` varchar(100) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `Tags_id` PRIMARY KEY(`id`),
	CONSTRAINT `Tags_slug_unique` UNIQUE(`slug`),
	CONSTRAINT `slug_unique_index` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `SiteSettings` (
	`id` varchar(36) NOT NULL,
	`key` varchar(255) NOT NULL,
	`value` text,
	`encrypted` boolean DEFAULT false,
	`enabled` boolean DEFAULT false,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `SiteSettings_id` PRIMARY KEY(`id`),
	CONSTRAINT `idx_key` UNIQUE(`key`)
);
--> statement-breakpoint
CREATE TABLE `UserBookmarks` (
	`user_id` varchar(100) NOT NULL,
	`post_id` varchar(36) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `UserBookmarks_user_id_post_id_pk` PRIMARY KEY(`user_id`,`post_id`)
);
--> statement-breakpoint
CREATE TABLE `accounts` (
	`id` varchar(36) NOT NULL,
	`account_id` text NOT NULL,
	`provider_id` text NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`access_token` text,
	`refresh_token` text,
	`id_token` text,
	`access_token_expires_at` timestamp,
	`refresh_token_expires_at` timestamp,
	`scope` text,
	`password` text,
	`created_at` timestamp NOT NULL,
	`updated_at` timestamp NOT NULL,
	CONSTRAINT `accounts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `Permissions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` enum('dashboard:access','posts:create','posts:edit','posts:delete','posts:publish','posts:read','posts:schedule','posts:review','posts:view','users:read','users:write','users:edit','users:delete','roles:read','roles:write','roles:delete','media:upload','media:read','media:delete','media:edit','settings:read','settings:write','comments:create','comments:moderate','comments:read','comments:delete','comments:reply','newsletters:read','newsletters:write','newsletters:delete','auth:register','auth:login','categories:create','categories:read','tags:read','tags:create','pages:read','pages:edit','pages:delete','pages:write','seo:edit','seo:view','analytics:view','analytics:export') NOT NULL,
	`description` varchar(255),
	CONSTRAINT `Permissions_id` PRIMARY KEY(`id`),
	CONSTRAINT `Permissions_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `RolePermissions` (
	`id` varchar(36) NOT NULL,
	`role_id` int NOT NULL,
	`permission_id` int NOT NULL,
	CONSTRAINT `RolePermissions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `Roles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` enum('admin','editor','author','contributor','moderator','seo_manager','newsletter_manager','subscriber','public') NOT NULL,
	`description` varchar(255),
	CONSTRAINT `Roles_id` PRIMARY KEY(`id`),
	CONSTRAINT `Roles_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `sessions` (
	`id` varchar(36) NOT NULL,
	`expires_at` timestamp NOT NULL,
	`token` varchar(255) NOT NULL,
	`created_at` timestamp NOT NULL,
	`updated_at` timestamp NOT NULL,
	`ip_address` text,
	`user_agent` text,
	`user_id` varchar(36) NOT NULL,
	CONSTRAINT `sessions_id` PRIMARY KEY(`id`),
	CONSTRAINT `sessions_token_unique` UNIQUE(`token`)
);
--> statement-breakpoint
CREATE TABLE `UserRoles` (
	`id` varchar(36) NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`role_id` int NOT NULL,
	CONSTRAINT `UserRoles_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `UserSocials` (
	`id` varchar(36) NOT NULL,
	`user_id` varchar(100) NOT NULL,
	`github` varchar(100),
	`facebook` varchar(100),
	`email` varchar(100),
	`website` varchar(100),
	`twitter` varchar(100),
	`instagram` varchar(100),
	`linkedin` varchar(100),
	`youtube` varchar(100),
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `UserSocials_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `Users` (
	`id` varchar(36) NOT NULL,
	`bio` varchar(255),
	`title` varchar(100),
	`avatar` varchar(255),
	`social_id` varchar(36),
	`meta_id` varchar(36),
	`account_status` varchar(30) DEFAULT 'active',
	`auth_id` varchar(100),
	`email_verified` boolean DEFAULT false,
	`name` varchar(120) NOT NULL,
	`email` varchar(255) NOT NULL,
	`image` text,
	`username` varchar(255),
	`display_username` text,
	`role_id` int NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `Users_id` PRIMARY KEY(`id`),
	CONSTRAINT `Users_email_unique` UNIQUE(`email`),
	CONSTRAINT `Users_username_unique` UNIQUE(`username`)
);
--> statement-breakpoint
CREATE TABLE `verifications` (
	`id` varchar(36) NOT NULL,
	`identifier` text NOT NULL,
	`value` text NOT NULL,
	`expires_at` timestamp NOT NULL,
	`created_at` timestamp,
	`updated_at` timestamp,
	CONSTRAINT `verifications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `accounts` ADD CONSTRAINT `accounts_user_id_Users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `Users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `sessions` ADD CONSTRAINT `sessions_user_id_Users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `Users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `Users` ADD CONSTRAINT `Users_role_id_Roles_id_fk` FOREIGN KEY (`role_id`) REFERENCES `Roles`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `idx_analytics_session` ON `PostViewAnalytics` (`post_id`,`created_at`,`session_id`);--> statement-breakpoint
CREATE INDEX `idx_post_views_session` ON `PostViews` (`post_id`,`user_id`,`viewed_at`);--> statement-breakpoint
CREATE INDEX `name_index` ON `Categories` (`name`);--> statement-breakpoint
CREATE INDEX `idx_status` ON `Comments` (`status`);--> statement-breakpoint
CREATE INDEX `idx-comments_post_id` ON `Comments` (`post_id`);--> statement-breakpoint
CREATE INDEX `idx_seo_title` ON `PostSeoMeta` (`title`);--> statement-breakpoint
CREATE INDEX `idx_seo_canonical_url` ON `PostSeoMeta` (`canonical_url`);--> statement-breakpoint
CREATE INDEX `idx_title_summary` ON `Posts` (`title`,`summary`);--> statement-breakpoint
CREATE INDEX `idx_status` ON `Posts` (`status`);--> statement-breakpoint
CREATE INDEX `idx_replies_status` ON `Replies` (`status`);--> statement-breakpoint
CREATE INDEX `idx_replies_comment_id` ON `Replies` (`comment_id`);--> statement-breakpoint
CREATE INDEX `name_index` ON `Tags` (`name`);--> statement-breakpoint
CREATE INDEX `permissions_idx_name` ON `Permissions` (`name`);--> statement-breakpoint
CREATE INDEX `roles_idx_name` ON `Roles` (`name`);