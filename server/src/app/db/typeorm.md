

Typeorm:
-  yarn mgrt:create -d src/app/data/migrations -n Games2011

https://github.com/typeorm/typeorm/issues/8810

{
  "scripts": {
    "typeorm": "typeorm-ts-node-commonjs -d ./src/db/ormconfig.ts",
    "migration:generate": "npm run typeorm migration:generate",
    "migration:show": "npm run typeorm migration:show",
    "migration:run": "npm run typeorm migration:run",
    "migration:revert": "npm run typeorm migration:revert",
    "migration:create": "typeorm-ts-node-commonjs migration:create"
  }
}

npm run migration:generate src/db/migrations/init-photos

npm run migration:create src/db/migrations/update-photos-data

npm run migration:show

npm run migration:run

npm run migration:revert



name = https://github.com/typeorm/typeorm/issues/3867