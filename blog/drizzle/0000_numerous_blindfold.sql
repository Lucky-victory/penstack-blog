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
	`post_id` int NOT NULL,
	`author_id` int NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `Comments_id` PRIMARY KEY(`id`)
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
	`meta_description` varchar(255),
	`meta_title` varchar(150),
	`post_id` varchar(255),
	`slug` varchar(255) NOT NULL,
	`status` enum('draft','published','deleted') DEFAULT 'draft',
	`author_id` int NOT NULL,
	`visibility` enum('public','private') DEFAULT 'public',
	`category_id` int,
	`views` int DEFAULT 0,
	`featured_image` json,
	`created_at` timestamp DEFAULT (now()),
	`published_at` timestamp GENERATED ALWAYS AS ((
        CASE 
            WHEN status = 'published' THEN updated_at
            ELSE NULL
        END
    )) STORED,
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `Posts_id` PRIMARY KEY(`id`),
	CONSTRAINT `Posts_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `Replies` (
	`id` int AUTO_INCREMENT NOT NULL,
	`content` text,
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
	CONSTRAINT `Permissions_id` PRIMARY KEY(`id`)
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
	CONSTRAINT `Roles_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `Users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(120) NOT NULL,
	`email` varchar(255) NOT NULL,
	`password` varchar(255),
	`bio` varchar(255),
	`username` varchar(255),
	`avatar` varchar(255),
	`auth_type` enum('local','google','github') DEFAULT 'local',
	`role_id` int NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `Users_id` PRIMARY KEY(`id`)
);
