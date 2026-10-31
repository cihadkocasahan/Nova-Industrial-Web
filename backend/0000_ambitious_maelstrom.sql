CREATE TABLE `admin_users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(255) NOT NULL,
	`password` varchar(255) NOT NULL,
	`name` varchar(255),
	`active` boolean DEFAULT true,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `admin_users_id` PRIMARY KEY(`id`),
	CONSTRAINT `admin_users_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `article_translations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`article_id` int NOT NULL,
	`language_code` varchar(5) NOT NULL,
	`title` varchar(255) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`excerpt` text,
	`content` text NOT NULL,
	`seo_title` varchar(255),
	`seo_description` text,
	`seo_keywords` text,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `article_translations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `articles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`excerpt` text,
	`content` text NOT NULL,
	`featured_image` varchar(500),
	`category_id` int,
	`author_id` int,
	`published_at` timestamp,
	`visible` boolean DEFAULT true,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `articles_id` PRIMARY KEY(`id`),
	CONSTRAINT `articles_title_unique` UNIQUE(`title`),
	CONSTRAINT `articles_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `brands` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`logo_url` varchar(500) NOT NULL,
	`website_url` varchar(500),
	`order` int DEFAULT 0,
	`active` boolean DEFAULT true,
	`visible` boolean DEFAULT true,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `brands_id` PRIMARY KEY(`id`),
	CONSTRAINT `brands_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `categories` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`description` text,
	`visible` boolean DEFAULT true,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `categories_id` PRIMARY KEY(`id`),
	CONSTRAINT `categories_name_unique` UNIQUE(`name`),
	CONSTRAINT `categories_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `category_translations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`category_id` int NOT NULL,
	`language_code` varchar(5) NOT NULL,
	`name` varchar(255) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`description` text,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `category_translations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `contact_forms` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	`phone` varchar(50),
	`subject` varchar(255),
	`message` text NOT NULL,
	`read` boolean DEFAULT false,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `contact_forms_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `hero_section_translations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`hero_section_id` int NOT NULL,
	`language_code` varchar(5) NOT NULL,
	`title` varchar(255) NOT NULL,
	`subtitle` text,
	`cta_text` varchar(100),
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `hero_section_translations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `hero_sections` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`subtitle` text,
	`cta_text` varchar(100),
	`cta_link` varchar(255),
	`background_image` varchar(500),
	`active` boolean DEFAULT false,
	`order` int DEFAULT 0,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `hero_sections_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `page_translations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`page_id` int NOT NULL,
	`language_code` varchar(5) NOT NULL,
	`title` varchar(255) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`content` text NOT NULL,
	`seo_title` varchar(255),
	`seo_description` text,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `page_translations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `pages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`content` text NOT NULL,
	`seo_title` varchar(255),
	`seo_description` text,
	`published_at` timestamp,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `pages_id` PRIMARY KEY(`id`),
	CONSTRAINT `pages_title_unique` UNIQUE(`title`),
	CONSTRAINT `pages_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `project_images` (
	`id` int AUTO_INCREMENT NOT NULL,
	`project_id` int NOT NULL,
	`image_url` varchar(500) NOT NULL,
	`order` int DEFAULT 0,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `project_images_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `project_translations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`project_id` int NOT NULL,
	`language_code` varchar(5) NOT NULL,
	`title` varchar(255) NOT NULL,
	`slug` varchar(255),
	`description` text,
	`content` text NOT NULL,
	`location` varchar(255),
	`seo_title` varchar(255),
	`seo_description` text,
	`seo_keywords` text,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `project_translations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `projects` (
	`id` int AUTO_INCREMENT NOT NULL,
	`category_id` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`slug` varchar(255),
	`description` text,
	`content` text NOT NULL,
	`image` varchar(500),
	`location` varchar(255),
	`seo_title` varchar(255),
	`seo_description` text,
	`seo_keywords` text,
	`order` int DEFAULT 0,
	`visible` boolean DEFAULT true,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `projects_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `seo_keywords` (
	`id` int AUTO_INCREMENT NOT NULL,
	`keyword` varchar(255) NOT NULL,
	`order` int DEFAULT 0,
	`active` boolean DEFAULT true,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `seo_keywords_id` PRIMARY KEY(`id`),
	CONSTRAINT `seo_keywords_keyword_unique` UNIQUE(`keyword`)
);
--> statement-breakpoint
CREATE TABLE `service_translations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`service_id` int NOT NULL,
	`language_code` varchar(5) NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `service_translations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `services` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text NOT NULL,
	`icon` varchar(255),
	`icon_text` varchar(100),
	`order` int DEFAULT 0,
	`visible` boolean DEFAULT true,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `services_id` PRIMARY KEY(`id`),
	CONSTRAINT `services_title_unique` UNIQUE(`title`)
);
--> statement-breakpoint
CREATE TABLE `settings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`key` varchar(255) NOT NULL,
	`value` text,
	`description` text,
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `settings_id` PRIMARY KEY(`id`),
	CONSTRAINT `settings_key_unique` UNIQUE(`key`)
);
--> statement-breakpoint
ALTER TABLE `article_translations` ADD CONSTRAINT `article_translations_article_id_articles_id_fk` FOREIGN KEY (`article_id`) REFERENCES `articles`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `articles` ADD CONSTRAINT `articles_category_id_categories_id_fk` FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `category_translations` ADD CONSTRAINT `category_translations_category_id_categories_id_fk` FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `hero_section_translations` ADD CONSTRAINT `hero_section_translations_hero_section_id_hero_sections_id_fk` FOREIGN KEY (`hero_section_id`) REFERENCES `hero_sections`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `page_translations` ADD CONSTRAINT `page_translations_page_id_pages_id_fk` FOREIGN KEY (`page_id`) REFERENCES `pages`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `project_images` ADD CONSTRAINT `project_images_project_id_projects_id_fk` FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `project_translations` ADD CONSTRAINT `project_translations_project_id_projects_id_fk` FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `projects` ADD CONSTRAINT `projects_category_id_categories_id_fk` FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `service_translations` ADD CONSTRAINT `service_translations_service_id_services_id_fk` FOREIGN KEY (`service_id`) REFERENCES `services`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `email_idx` ON `admin_users` (`email`);--> statement-breakpoint
CREATE INDEX `active_idx` ON `admin_users` (`active`);--> statement-breakpoint
CREATE INDEX `article_id_idx` ON `article_translations` (`article_id`);--> statement-breakpoint
CREATE INDEX `language_code_idx` ON `article_translations` (`language_code`);--> statement-breakpoint
CREATE INDEX `slug_idx` ON `article_translations` (`slug`);--> statement-breakpoint
CREATE INDEX `unique_article_language` ON `article_translations` (`article_id`,`language_code`);--> statement-breakpoint
CREATE INDEX `slug_idx` ON `articles` (`slug`);--> statement-breakpoint
CREATE INDEX `category_idx` ON `articles` (`category_id`);--> statement-breakpoint
CREATE INDEX `published_idx` ON `articles` (`published_at`);--> statement-breakpoint
CREATE INDEX `visible_idx` ON `articles` (`visible`);--> statement-breakpoint
CREATE INDEX `active_idx` ON `brands` (`active`);--> statement-breakpoint
CREATE INDEX `visible_idx` ON `brands` (`visible`);--> statement-breakpoint
CREATE INDEX `order_idx` ON `brands` (`order`);--> statement-breakpoint
CREATE INDEX `slug_idx` ON `categories` (`slug`);--> statement-breakpoint
CREATE INDEX `visible_idx` ON `categories` (`visible`);--> statement-breakpoint
CREATE INDEX `category_id_idx` ON `category_translations` (`category_id`);--> statement-breakpoint
CREATE INDEX `language_code_idx` ON `category_translations` (`language_code`);--> statement-breakpoint
CREATE INDEX `slug_idx` ON `category_translations` (`slug`);--> statement-breakpoint
CREATE INDEX `unique_category_language` ON `category_translations` (`category_id`,`language_code`);--> statement-breakpoint
CREATE INDEX `hero_section_id_idx` ON `hero_section_translations` (`hero_section_id`);--> statement-breakpoint
CREATE INDEX `language_code_idx` ON `hero_section_translations` (`language_code`);--> statement-breakpoint
CREATE INDEX `unique_hero_section_language` ON `hero_section_translations` (`hero_section_id`,`language_code`);--> statement-breakpoint
CREATE INDEX `page_id_idx` ON `page_translations` (`page_id`);--> statement-breakpoint
CREATE INDEX `language_code_idx` ON `page_translations` (`language_code`);--> statement-breakpoint
CREATE INDEX `slug_idx` ON `page_translations` (`slug`);--> statement-breakpoint
CREATE INDEX `unique_page_language` ON `page_translations` (`page_id`,`language_code`);--> statement-breakpoint
CREATE INDEX `slug_idx` ON `pages` (`slug`);--> statement-breakpoint
CREATE INDEX `project_idx` ON `project_images` (`project_id`);--> statement-breakpoint
CREATE INDEX `project_id_idx` ON `project_translations` (`project_id`);--> statement-breakpoint
CREATE INDEX `language_code_idx` ON `project_translations` (`language_code`);--> statement-breakpoint
CREATE INDEX `slug_idx` ON `project_translations` (`slug`);--> statement-breakpoint
CREATE INDEX `unique_project_language` ON `project_translations` (`project_id`,`language_code`);--> statement-breakpoint
CREATE INDEX `category_idx` ON `projects` (`category_id`);--> statement-breakpoint
CREATE INDEX `slug_idx` ON `projects` (`slug`);--> statement-breakpoint
CREATE INDEX `visible_idx` ON `projects` (`visible`);--> statement-breakpoint
CREATE INDEX `keyword_idx` ON `seo_keywords` (`keyword`);--> statement-breakpoint
CREATE INDEX `active_idx` ON `seo_keywords` (`active`);--> statement-breakpoint
CREATE INDEX `order_idx` ON `seo_keywords` (`order`);--> statement-breakpoint
CREATE INDEX `service_id_idx` ON `service_translations` (`service_id`);--> statement-breakpoint
CREATE INDEX `language_code_idx` ON `service_translations` (`language_code`);--> statement-breakpoint
CREATE INDEX `unique_service_language` ON `service_translations` (`service_id`,`language_code`);--> statement-breakpoint
CREATE INDEX `visible_idx` ON `services` (`visible`);--> statement-breakpoint
CREATE INDEX `key_idx` ON `settings` (`key`);