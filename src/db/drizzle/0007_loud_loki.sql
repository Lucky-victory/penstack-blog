CREATE TABLE `SiteSettings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`key` varchar(255) NOT NULL,
	`value` text,
	`enabled` boolean DEFAULT false,
	`created_at` timestamp DEFAULT '2024-12-05 14:50:15.702',
	`updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `SiteSettings_id` PRIMARY KEY(`id`)
);
