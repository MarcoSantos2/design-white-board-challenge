# Database Migrations

This directory contains TypeORM migrations for the UX Whiteboard Challenge backend.

## Migration Scripts

The following npm scripts are available for managing migrations:

### Create Database
```bash
npm run db:create
```
Creates the PostgreSQL database if it doesn't exist.

### Generate Migrations
```bash
npm run migration:generate -- src/migrations/MigrationName
```
Generates a new migration based on entity changes. Replace `MigrationName` with a descriptive name.

### Create Empty Migration
```bash
npm run migration:create -- src/migrations/MigrationName
```
Creates a new empty migration file for custom SQL.

### Run Migrations
```bash
npm run migration:run
```
Executes all pending migrations.

### Revert Migration
```bash
npm run migration:revert
```
Reverts the last executed migration.

### Show Migration Status
```bash
npm run migration:show
```
Shows which migrations have been executed.

### Setup Database (Create + Migrate)
```bash
npm run db:setup
```
Creates the database and runs all migrations.

## Development Workflow

1. **Initial Setup**: Run `npm run db:setup` to create the database and run initial migrations.

2. **Making Changes**: 
   - Update your entity files
   - Generate migration: `npm run migration:generate -- src/migrations/DescriptiveName`
   - Review the generated migration
   - Run migration: `npm run migration:run`

3. **Production**: Migrations run automatically when `NODE_ENV !== 'development'`

## Initial Migration Files

- `1700000000001-CreateUserTable.ts` - Creates the users table
- `1700000000002-CreateConversationTable.ts` - Creates the conversations table  
- `1700000000003-CreateMessageTable.ts` - Creates the messages table with enum

## Important Notes

- Always review generated migrations before running them
- Test migrations on a copy of production data before deploying
- Keep migrations small and focused on single changes
- Never edit migration files after they've been run in production
- Use descriptive names for migrations 