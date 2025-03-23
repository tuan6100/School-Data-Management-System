import {Injectable, Logger, OnModuleInit} from "@nestjs/common"
import { MikroORM } from "@mikro-orm/core"

@Injectable()
export class AppService implements OnModuleInit {
    constructor(
        private readonly orm: MikroORM,
        private readonly logger: Logger
    ) {
        this.logger = new Logger(AppService.name, {timestamp: true})
    }

    async onModuleInit() {
        await this.generateSchema()
    }

    async generateSchema() {
        const generator = this.orm.schema
        try {
            this.logger.log("Checking for schema existence...")
            const exists = await generator.ensureDatabase()
            if (!exists) {
                this.logger.log("The schema does not exist. Creating the new one...")
                await generator.createSchema()
                this.logger.log("The schema has been created successfully")
            } else {
                this.logger.log("The schema has existed, checking for updating...")
                let updateDump = await generator.getUpdateSchemaSQL()
                if (updateDump && updateDump.trim().length > 0) {
                    const lines = updateDump.split('\n')
                    this.logger.debug("Before filtering: \n", lines)
                    const filteredLines = lines.filter(line => !line.trim().match(/DROP\s+CONSTRAINT|utf8/i))
                    updateDump = filteredLines.join('\n')
                    this.logger.debug("After filtering: \n", updateDump)
                    if (updateDump.trim().length > 0) {
                        this.logger.log("Detected changes in entity. Updating schema...")
                        this.logger.log("Running SQL command: ", updateDump)
                        const connection = this.orm.em.getConnection()
                        await connection.execute(updateDump)
                        this.logger.log("The schema has been updated successfully ")
                    } else {
                        this.logger.log("All tables are up to date. Nothing to change.")
                    }
                } else {
                    this.logger.log("All tables are up to date. Nothing to change.")
                }
            }
            return { success: true }
        } catch (error) {
            this.logger.error("Error during scanning the schema", error)
            return { success: false, error }
        }
    }
}