ALTER TABLE `ContactMessages` 
DROP PRIMARY KEY,
MODIFY COLUMN `id` varchar(36) NOT NULL,
ADD PRIMARY KEY (`id`);--> statement-breakpoint

ALTER TABLE `Medias` 
DROP PRIMARY KEY,
MODIFY COLUMN `id` varchar(36) NOT NULL,
ADD PRIMARY KEY (`id`);--> statement-breakpoint

ALTER TABLE `EmailEvents` 
DROP PRIMARY KEY,
MODIFY COLUMN `id` varchar(36) NOT NULL,
ADD PRIMARY KEY (`id`);--> statement-breakpoint

ALTER TABLE `NewsLetterRecipients` 
DROP PRIMARY KEY,
MODIFY COLUMN `id` varchar(36) NOT NULL,
ADD PRIMARY KEY (`id`);--> statement-breakpoint

ALTER TABLE `NewsLetterSubscribers` 
DROP PRIMARY KEY,
MODIFY COLUMN `id` varchar(36) NOT NULL,
ADD PRIMARY KEY (`id`);--> statement-breakpoint

ALTER TABLE `NewsLetters` 
DROP PRIMARY KEY,
MODIFY COLUMN `id` varchar(36) NOT NULL,
ADD PRIMARY KEY (`id`);--> statement-breakpoint

ALTER TABLE `ActivePostViewers` 
DROP PRIMARY KEY,
MODIFY COLUMN `id` varchar(36) NOT NULL,
ADD PRIMARY KEY (`id`);--> statement-breakpoint

ALTER TABLE `PostViewAnalytics` 
DROP PRIMARY KEY,
MODIFY COLUMN `id` varchar(36) NOT NULL,
ADD PRIMARY KEY (`id`);--> statement-breakpoint

ALTER TABLE `PostViews` 
DROP PRIMARY KEY,
MODIFY COLUMN `id` varchar(36) NOT NULL,
ADD PRIMARY KEY (`id`);--> statement-breakpoint

ALTER TABLE `PostReactions` 
DROP PRIMARY KEY,
MODIFY COLUMN `id` varchar(36) NOT NULL,
ADD PRIMARY KEY (`id`);--> statement-breakpoint

ALTER TABLE `PostShares` 
DROP PRIMARY KEY,
MODIFY COLUMN `id` varchar(36) NOT NULL,
ADD PRIMARY KEY (`id`);--> statement-breakpoint

ALTER TABLE `ReactionTypes` 
DROP PRIMARY KEY,
MODIFY COLUMN `id` varchar(36) NOT NULL,
ADD PRIMARY KEY (`id`);--> statement-breakpoint

ALTER TABLE `Categories` 
DROP PRIMARY KEY,
MODIFY COLUMN `id` varchar(36) NOT NULL,
ADD PRIMARY KEY (`id`);--> statement-breakpoint

ALTER TABLE `Comments` 
DROP PRIMARY KEY,
MODIFY COLUMN `id` varchar(36) NOT NULL,
ADD PRIMARY KEY (`id`);--> statement-breakpoint

ALTER TABLE `PostSeoMeta` 
DROP PRIMARY KEY,
MODIFY COLUMN `id` varchar(36) NOT NULL,
ADD PRIMARY KEY (`id`);--> statement-breakpoint

ALTER TABLE `Posts` 
DROP PRIMARY KEY,
MODIFY COLUMN `id` varchar(36) NOT NULL,
ADD PRIMARY KEY (`id`);--> statement-breakpoint

ALTER TABLE `Replies` 
DROP PRIMARY KEY,
MODIFY COLUMN `id` varchar(36) NOT NULL,
ADD PRIMARY KEY (`id`);--> statement-breakpoint

ALTER TABLE `Tags` 
DROP PRIMARY KEY,
MODIFY COLUMN `id` varchar(36) NOT NULL,
ADD PRIMARY KEY (`id`);--> statement-breakpoint

ALTER TABLE `SiteSettings` 
DROP PRIMARY KEY,
MODIFY COLUMN `id` varchar(36) NOT NULL,
ADD PRIMARY KEY (`id`);--> statement-breakpoint

ALTER TABLE `accounts` 
DROP PRIMARY KEY,
MODIFY COLUMN `user_id` varchar(36) NOT NULL,
ADD PRIMARY KEY (`user_id`);--> statement-breakpoint

ALTER TABLE `Permissions` 
DROP PRIMARY KEY,
MODIFY COLUMN `id` varchar(36) NOT NULL,
ADD PRIMARY KEY (`id`);--> statement-breakpoint

ALTER TABLE `RolePermissions` 
DROP PRIMARY KEY,
MODIFY COLUMN `id` varchar(36) NOT NULL,
ADD PRIMARY KEY (`id`);--> statement-breakpoint

ALTER TABLE `Roles` 
DROP PRIMARY KEY,
MODIFY COLUMN `id` varchar(36) NOT NULL,
ADD PRIMARY KEY (`id`);--> statement-breakpoint

ALTER TABLE `sessions` 
DROP PRIMARY KEY,
MODIFY COLUMN `user_id` varchar(36) NOT NULL,
ADD PRIMARY KEY (`user_id`);--> statement-breakpoint

ALTER TABLE `UserRoles` 
DROP PRIMARY KEY,
MODIFY COLUMN `id` varchar(36) NOT NULL,
ADD PRIMARY KEY (`id`);--> statement-breakpoint

ALTER TABLE `UserSocials` 
DROP PRIMARY KEY,
MODIFY COLUMN `id` varchar(36) NOT NULL,
ADD PRIMARY KEY (`id`);--> statement-breakpoint

ALTER TABLE `VerificationTokens` 
DROP PRIMARY KEY,
MODIFY COLUMN `id` varchar(36) NOT NULL,
ADD PRIMARY KEY (`id`);