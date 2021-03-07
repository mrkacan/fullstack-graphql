import {ApolloClient} from 'apollo-client'
import {InMemoryCache} from 'apollo-cache-inmemory'
import {HttpLink} from 'apollo-link-http'
import {ApolloLink} from 'apollo-link'
import {setContext} from 'apollo-link-context'

/**
 * Create a new apollo client and export as default
 */
const httpLink = new HttpLink({uri: 'http://localhost:4000/'})

const delay = setContext(request => new Promise((success, fail)=> {
    setTimeout(()=> {
        success()
    }, 800)

}))

const link = ApolloLink.from([
    delay,
    httpLink
])

const cache = new InMemoryCache()

const client = new ApolloClient({
    link,
    cache
})

export default client
