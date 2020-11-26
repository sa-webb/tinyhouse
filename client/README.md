# GraphQL Client WorkFlow
- Invoke a POST or GET HTTP method
    - queries are executed in parallel (retrieve and persist data)
    - mutations are executed sequentially (mutate data)

- Specify content of request as applciation/json
    - GraphQL documents passed as JSON

- Reference the endpoint

fetch() - native browser support 