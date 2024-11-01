CREATE TABLE `Medias` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`url` varchar(255) NOT NULL,
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
CREATE TABLE `NewsLetters` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(255) NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `NewsLetters_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `ActivePostViewers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`post_id` int NOT NULL,
	`user_id` int,
	`session_id` varchar(255) NOT NULL,
	`last_active` timestamp ON UPDATE CURRENT_TIMESTAMP,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `ActivePostViewers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `PostViewAnalytics` (
	`id` int AUTO_INCREMENT NOT NULL,
	`post_id` int NOT NULL,
	`user_id` int,
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
CREATE TABLE `PostViewStats` (
	`id` int AUTO_INCREMENT NOT NULL,
	`post_id` int NOT NULL,
	`view_date` timestamp NOT NULL,
	`total_views` int NOT NULL DEFAULT 0,
	`unique_views` int NOT NULL DEFAULT 0,
	`registered_user_views` int DEFAULT 0,
	`anonymous_views` int DEFAULT 0,
	CONSTRAINT `PostViewStats_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `PostViews` (
	`id` int AUTO_INCREMENT NOT NULL,
	`post_id` int NOT NULL,
	`user_id` int,
	`ip_address` varchar(45),
	`user_agent` varchar(255),
	`referrer` varchar(255),
	`viewed_at` timestamp DEFAULT (now()),
	CONSTRAINT `PostViews_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `PostReactions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`post_id` int NOT NULL,
	`user_id` int NOT NULL,
	`reaction_type_id` int NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `PostReactions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `ReactionTypes` (
	`id` int AUTO_INCREMENT NOT NULL,
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
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `Categories_id` PRIMARY KEY(`id`),
	CONSTRAINT `Categories_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `Comments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`content` text,
	`status` enum('approved','pending','disapproved','deleted') DEFAULT 'pending',
	`post_id` int NOT NULL,
	`author_id` int NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `Comments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `PostSeoMeta` (
	`id` int AUTO_INCREMENT NOT NULL,
	`post_id` int NOT NULL,
	`title` varchar(150),
	`canonical_url` varchar(255),
	`description` varchar(255),
	CONSTRAINT `PostSeoMeta_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `PostTags` (
	`post_id` int NOT NULL,
	`tag_id` int NOT NULL
);
--> statement-breakpoint
CREATE TABLE `Posts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) DEFAULT 'Untitled',
	`content` longtext,
	`summary` varchar(255),
	`meta_id` int,
	`post_id` varchar(255),
	`slug` varchar(255) NOT NULL,
	`status` enum('draft','published','deleted') DEFAULT 'draft',
	`author_id` int NOT NULL,
	`visibility` enum('public','private') DEFAULT 'public',
	`category_id` int,
	`is_sticky` boolean DEFAULT false,
	`reading_time` int,
	`allow_comments` boolean DEFAULT true,
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
	CONSTRAINT `Posts_slug_unique` UNIQUE(`slug`),
	CONSTRAINT `slug_unique_index` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `Replies` (
	`id` int AUTO_INCREMENT NOT NULL,
	`content` text,
	`status` enum('approved','pending','disapproved','deleted') DEFAULT 'pending',
	`comment_id` int NOT NULL,
	`author_id` int NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `Replies_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `Tags` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `Tags_id` PRIMARY KEY(`id`),
	CONSTRAINT `Tags_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `Permissions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(50) NOT NULL,
	`description` varchar(255),
	CONSTRAINT `Permissions_id` PRIMARY KEY(`id`),
	CONSTRAINT `Permissions_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `RolePermissions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`role_id` int NOT NULL,
	`permission_id` int NOT NULL,
	CONSTRAINT `RolePermissions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `Roles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(50) NOT NULL,
	`description` varchar(255),
	CONSTRAINT `Roles_id` PRIMARY KEY(`id`),
	CONSTRAINT `Roles_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `UserSocials` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`github` varchar(100),
	`facebook` varchar(100),
	`email` varchar(100),
	`website` varchar(100),
	CONSTRAINT `UserSocials_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `Users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(120) NOT NULL,
	`email` varchar(255) NOT NULL,
	`password` varchar(255),
	`bio` varchar(255),
	`title` varchar(100),
	`username` varchar(255),
	`avatar` varchar(255),
	`social_id` int,
	`auth_type` enum('local','google','github','facebook') DEFAULT 'local',
	`role_id` int NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `Users_id` PRIMARY KEY(`id`)
);
