[![Moleculer](https://badgen.net/badge/Powered%20by/Moleculer/0e83cd)](https://moleculer.services)

# moleculer-ollama
This is a [Moleculer](https://moleculer.services/)-based microservices project. Generated with the [Moleculer CLI](https://moleculer.services/docs/0.15/moleculer-cli.html).

## Template architecture
Moleculer supports different [deployment modes](https://moleculer.services/docs/0.15/clustering.html). The figures below represent the deployment and production architectures.
Switching between the architectures is [automatically](https://moleculer.services/docs/0.15/clustering.html) handled by moleculer. To run in dev mode use `npm run dev`, for production mode run `npm run dc:up`.

### Development architecture view

```mermaid
flowchart LR
    classDef svc fill:lightblue
    classDef brk fill:#fff2cc
    classDef ext fill:violet

    U(User browser)
    U --> A
    
    subgraph node1 [Monolith Node]
    style node1 fill:#dae8fc,stroke:#c9d7eb
    A("**API Gateway**
    -HTTP Server
    
    
    ")
    A --> B

    B((Service Broker))

    G(Greeter Service):::svc
    B <--> G
    
    
    I(Inventory Service):::svc
    CH(Channel Adapter)
    B <--> I
    I <--> CH
    CH <--> NATS:::ext
    
    O(Orders Service):::svc
    WF(Workflow Adapter)
    B <--> O
    O <--> WF
    WF <--> Redis:::ext
    
    end

    style B fill:orange
    style A fill:lightgreen
    style U fill:lightcyan
    style node1 fill:#dae8fc,stroke:#c9d7eb
```

### Production architecture view

```mermaid
flowchart LR
    classDef svc fill:lightblue
    classDef brk fill:#fff2cc
    classDef ext fill:violet

    TX{  Transporter}:::ext

    subgraph node1 [Node 1]
    style node1 fill:#dae8fc,stroke:#c9d7eb
    A("**API Gateway**
    -HTTP Server
    
    
    ")
    style A fill:lightgreen
    B1((Service Broker)):::brk
    A --> B1
    end
    B1 --> TX
    U(User browser)
    style U fill:lightcyan
    U --> A

    subgraph node2 [Node 2]
    style node2 fill:#dae8fc,stroke:#c9d7eb
    B2((Service Broker)):::brk
    G(Greeter Service):::svc
    B2 <--> G
    end
    TX --> B2


    subgraph node4 [Node 4]
    style node4 fill:#dae8fc,stroke:#c9d7eb
    B4((Service Broker)):::brk
    I(Inventory Service):::svc
    CH(Channel Adapter)
    B4 <--> I
    I <--> CH
    end
    TX --> B4
    CH <--> NATS:::ext

    subgraph node5 [Node 5]
    style node5 fill:#dae8fc,stroke:#c9d7eb
    B5((Service Broker)):::brk
    O(Orders Service):::svc
    WF(Workflow Adapter)
    B5 <--> O
    O <--> WF
    end
    TX --> B5
    WF <--> Redis:::ext
```

## Usage
Start the project with `npm run dev` command. 
After starting, open the http://localhost:3000/ URL in your browser. 
On the welcome page you can test the generated services via API Gateway and check the nodes & services.



In the terminal, try using [Moleculer REPL](https://moleculer.services/docs/0.15/moleculer-repl.html) by running the following commands:
- `nodes` - List all connected nodes.
- `services` - List all the available services.
- `actions` - List all registered service actions.
- `info` - List node info (e.g., IP, memory usage).
- `call greeter.hello` - Call the `greeter.hello` action.
- `call greeter.welcome --name John` - Call the `greeter.welcome` action with the `name` parameter.



## Services
- **api**: API Gateway services
- **greeter**: Sample service with `hello` and `welcome` actions.


## Useful links

* Moleculer website: https://moleculer.services/
* Moleculer Documentation: https://moleculer.services/docs/0.15/

* Moleculer API Gateway: https://moleculer.services/docs/0.15/moleculer-web.html


* Moleculer Channels: https://github.com/moleculerjs/moleculer-channels
* Moleculer Workflows: https://github.com/moleculerjs/workflows

## NPM scripts

- `npm run dev`: Start development mode (load all services locally with hot-reload & REPL)
- `npm run start`: Start production mode (set `SERVICES` env variable to load certain services)
- `npm run cli`: Start a CLI and connect to production. Don't forget to set production namespace with `--ns` argument in script
- `npm run ci`: Run continuous test mode with watching
- `npm test`: Run tests & generate coverage report
- `npm run dc:up`: Start the stack with Docker Compose
- `npm run dc:down`: Stop the stack with Docker Compose
