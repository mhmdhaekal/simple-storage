CREATE TABLE `file` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`soft_id` text(36) NOT NULL,
	`key` text(512) NOT NULL,
	`file_size` integer NOT NULL,
	`mime_type` text NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `file_id_unique` ON `file` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `file_soft_id_unique` ON `file` (`soft_id`);