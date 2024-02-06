# rapini-usage-demo
## Setting up new endpoints 

---

NestJS provides a sweet tool to generate all the boilerplate require to setup REST endpoints.
Using the CURD generator
Before using the CRUD generator, please install the following package:
```typescript
npm install @nestjs/mapped-types
```
In the root of your project, just type in:
```typescript
nest g resource tasks
```
Then select a REST API:
```typescript
? What transport layer do you use? (Use arrow keys)
❯ REST API
  GraphQL (code first)
  GraphQL (schema first)
  Microservice (non-HTTP)
  WebSockets
```
Then choose YES
```typescript
? Would you like to generate CRUD entry points? (Y/n)
```
You should have the following output:
```typescript
CREATE src/tasks/tasks.controller.spec.ts (566 bytes)
CREATE src/tasks/tasks.controller.ts (890 bytes)
CREATE src/tasks/tasks.module.ts (247 bytes)
CREATE src/tasks/tasks.service.spec.ts (453 bytes)
CREATE src/tasks/tasks.service.ts (609 bytes)
CREATE src/tasks/dto/create-task.dto.ts (30 bytes)
CREATE src/tasks/dto/update-task.dto.ts (169 bytes)
CREATE src/tasks/entities/task.entity.ts (21 bytes)
UPDATE src/app.module.ts (312 bytes)
```
The NestJS CLI has just generated a lot of boilerplate code for you.
The generated files including  tasks.service.ts, tasks.controller.ts,  tasks.module.ts,  app.module.ts.
## Creating the OpenAPI document

---

The bootstrap function (in main.ts) is where you're going to instantiate the OpenAPI module.
```typescript
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as YAML from 'yaml';
import * as fs from 'fs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:3000',
  });

  const config = new DocumentBuilder()
    .setTitle('Tasks')
    .setDescription('The tasks API description')
    .setVersion('1.0')
    .addTag('tasks')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  // fs.writeFileSync('./swagger-spec.yaml', YAML.stringify(document));
  console.log('document:', document);
  SwaggerModule.setup('api', app, document);

  const yamlString: string = YAML.stringify(document, {});
  console.log('yamlString:', yamlString);
  fs.writeFileSync('./swagger-open-api.yaml', yamlString); // generate file swagger-open-api.yaml

  const file = fs.readFileSync('./swagger-open-api.yaml', 'utf8');

  await app.listen(3001);
}
bootstrap();
```

Now we can run the following command to start the HTTP server:
```typescript
npm run start
```

While the application is running, open your browser and navigate to [http://localhost:3000/api](http://localhost:3000/api). You should see the Swagger UI.
![Screenshot 2024-02-05 at 23.11.45.png](https://cdn.nlark.com/yuque/0/2024/png/12511545/1707145950707-8668db90-d80f-4b8d-8948-319842a2b741.png#averageHue=%23f7ead8&clientId=u5ef93e7f-2cb5-4&from=ui&id=u1bab47e2&originHeight=1170&originWidth=2830&originalType=binary&ratio=2&rotation=0&showTitle=false&size=145702&status=done&style=none&taskId=u935bbdea-3585-4534-8810-6cd27208684&title=)
As you can see, the SwaggerModule automatically reflects all of your endpoints.
And in the swagger-open-api.yaml, you will see the OpenAPI yaml document as below:
![openapi_ymal.png](https://cdn.nlark.com/yuque/0/2024/png/12511545/1707183073104-ae9d5f21-5434-4469-960d-62c060db81b8.png#averageHue=%23212120&clientId=u5ef93e7f-2cb5-4&from=ui&height=467&id=u900c2882&originHeight=908&originWidth=936&originalType=binary&ratio=2&rotation=0&showTitle=false&size=146416&status=done&style=none&taskId=u54529422-85d6-4cdc-b191-a4029b1fbce&title=&width=481)
## Rapini Getting Started

---

We use rapini with **npx**, which is pre-bundled with npm since npm version 5.2.0, it's pretty much a standard nowadays.

In the package.json of your Nestjs Project shown as below,  you can modify the scripts to meet your own needs:
```typescript
"scripts": {
    ...
    "rapini:react-query": "npx rapini react-query v4 -p ./swagger-open-api.yaml -n hello-tom-rapini-demo -pv 1.0.8 -o hello-tom-rapini-demo",
    "generate:react-query-bundle": "cd hello-tom-rapini-demo && npm install && npm run build",
    "pulish:react-query-bundle": "npm config set @tom:registry https://registry.npmjs.org && npm publish",
    "remove:react-query-bundle":"cd .. && mv -f ./hello-tom-rapini-demo ../",
    "generate:sdk":"npm run rapini:react-query && npm run generate:react-query-bundle && npm run pulish:react-query-bundle && npm run remove:react-query-bundle"
  },
```
## Scripts Description

---

Rapini CLI Arguments & Options can be reference [https://github.com/rametta/rapini](https://github.com/rametta/rapini)
```typescript
"rapini:react-query": "npx rapini react-query v4 -p ./swagger-open-api.yaml -n hello-tom-rapini-demo -pv 1.0.8 -o hello-tom-rapini-demo",
Options:
  -p, --path <path>                          Path to OpenAPI file
  -n, --name [name]                          Name to use for the generated package (default: "rapini-generated-package")
  -pv, --package-version [version]           Semver version to use for the generated package (default: "1.0.0")
  -o, --output-dir [directory]               Directory to output the generated package (default: "rapini-generated-package")
  -b, --base-url [url]                       Prefix every request with this url
  -r, --replacer [oldString] [newString...]  Replace part(s) of any route's path with simple string replacements. Ex: `-r /api/v1 /api/v2` would replace the v1 with v2 in every route
  -h, --help                                 display help for command
```

The script of generate:react-query-bundle:
```typescript
"generate:react-query-bundle": "cd hello-tom-rapini-demo && npm install && npm run build",
  // cd hello-tom-rapini-demo, enter into the react query code dir
  // npm install, install npm package
  // npm run build, generate js code from ts file
```
To publish, you must be a user of the npm registry. If you have a user account of the npm registry you publish packge to, use npm login to access your account from your ternimal.
The script of "pulish:react-query-bundle":
```typescript
"pulish:react-query-bundle": "npm config set @tom:registry https://registry.npmjs.org && npm publish",
  // npm config set @tom:registry https://registry.npmjs.org, config the registry you publish package to
  // npm publish, publish a package to your npm registry
```

The script of "remove:react-query-bundle",
```typescript
"remove:react-query-bundle":"cd .. && mv -f ./hello-tom-rapini-demo ../",
  // cd .., back to project directory,
  // cd .. && mv -f ./hello-tom-rapini-demo ../, move the react-query-bundle package from the project directory
```

Then we can run the following command to generate the React Query code with package.json, and publish it your own registry.
```typescript
npm run generate:sdk
```

As you can see, the React Query npm package ispublished to the registry automatically.
![npm-registry.png](https://cdn.nlark.com/yuque/0/2024/png/12511545/1707188117198-3b030c54-6f08-4bc9-95dc-5625ca439b07.png#averageHue=%23fbfafa&clientId=u5ef93e7f-2cb5-4&from=ui&height=372&id=ua06dd70e&originHeight=580&originWidth=981&originalType=binary&ratio=2&rotation=0&showTitle=false&size=72052&status=done&style=none&taskId=u9e3d38af-0360-4556-91c8-387747d4786&title=&width=629)
## Use Example in the React App

---

### install new dependencies 
in the react app project directory app, execute the following:
```typescript
npm install axios@0.27.2
npm install @tanstack/react-query@4.36.1
```
The version of axios and @tanstack/react-query must be consistent with the version of axios  and @tanstack/react-query in the package of hello-tom-rapini-demo shown as below:
![hello-tom-rapini-demo.png](https://cdn.nlark.com/yuque/0/2024/png/12511545/1707189119707-f77b89e6-cf51-45fb-a794-f4a3b4733a05.png#averageHue=%2323201f&clientId=u5ef93e7f-2cb5-4&from=ui&height=215&id=u0c922129&originHeight=235&originWidth=528&originalType=binary&ratio=2&rotation=0&showTitle=false&size=37982&status=done&style=none&taskId=uc140eb44-c733-4e41-b73d-1124966cefa&title=&width=484)
insert the script into the packages shown as below:
```typescript

  "scripts": {
    ...
    "update:sdk": "npm update hello-tom-rapini-demo --save"
  },
```

Used to configure an axios instance so that it is preconfigured to reach to NestJS.
```typescript
import axios from "axios";

const axiosInstance = axios.create({
    baseURL: `http://localhost:3001`
});

export default axiosInstance;
```

then import and use it like this:
```typescript
import { initialize } from "hello-tom-rapini-demo";
import axiosInstance  from  "../rapini/axios-instance";

export default function Example() {

  const config = initialize(axiosInstance);
  const { useTasksControllerFindOne } = config.queries;

  const id = "fake id";
  const { isLoading, isError, data } = useTasksControllerFindOne(`${id}`);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>An error has occurred</div>;
  return <div>Test {data?.title}</div>

}
```
Now, if you go on http://localhost:3000/ in your browser, you should see the message fake title.
## SDK update

---

If the version of api changes and is pushed to the npm registry, you can execute the following command to update sdk.
```typescript
npm run update:sdk
```



