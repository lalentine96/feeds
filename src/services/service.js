
export default class Service {
    constructor() {
        //this.rootLink = rootLink;
        this.token = '';
    }

    request = async(path, options) => {

        const defaultOptions = {
            credentials: 'include',
        };

        let headers = {
            "X-CSRF-Token": this.token
        };

        if (options) headers = {...headers, ...options["headers"]};
        
        const res = await fetch(`/api/${path}`, {...options, ...defaultOptions, headers});

        if (!res.ok) {
            throw new Error(`Could not fetch: ${res.status}`);
        }

        return res;
    }

    async getPosts(lastPostId, tags) {
        
        const res = await this
            .request(`data?${lastPostId ? `after=${lastPostId}`: ''}${tags && tags.length ? `&tags=${tags.join()}` : ''}`);

        const resJson = await res.json();
        
        const posts = resJson.posts.map(
            (post) => ({
                ...post, 
                hidden: true, 
                deleted: false, 
                // tags: new Set(['rust', 'programming', 'gilesystem', 'github'])
            })
        );

        return posts;
    }

    async postTags(id, isDelete, body) {
        return await this.request(`data/tag${isDelete ? '/delete' : ''}?post_id=${id}`, {
            method: 'POST',
            body: JSON.stringify(body),
        });
    }

    async deletePost(id) {
        return await this.request(`data?post_id=${id}`, {
            method: 'DELETE',
        });
    }

    async restorePost(id) {
        return await this.request(`data/restore?post_id=${id}`, {
            method: 'POST',
        });
    }

    async auth(action, login, password) {
        const res = await this.request(action, {
            method: 'POST',
            body: JSON.stringify({login, password}),     
        });

        const json = await res.json();
        this.setToken(json.csrf_token);
        return json.login;
    }

    async login(login, password) {
        return await this.auth('login', login, password);
    }

    async register(login, password) {
        return await this.auth('register', login, password);
    }

    async logout() {
        return await this.request(`logout`, {
            method: 'POST',       
        });
    }

    async reset() {
        return await this.request(`data/reset-demo`, {
            method: 'POST',       
        });
    }

    async whoAmI() {
        const res = await this.request(`whoami`);

        const json = await res.json();
        
        if (json.login) this.setToken(json.csrf_token);

        return json;
    }

    async suggestTags(prefix) {
        const res = await this.request(`tags/suggest?prefix=${prefix}`);

        const json = await res.json();
        return json.tags;
    }

    setToken = (token) => {
        this.token = token;
    }
}
