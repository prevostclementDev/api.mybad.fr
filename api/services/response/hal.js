class hal {

    #linkArray = {
        "get-all-courts": { "href": "/badminton-court", "isTemplated": false },
        "get-one-court": { "href": "/badminton-court/{id_court}?start_date_slot=2023-12-30&?end_date_slot=2023-12-31", "isTemplated": true },
        "get-all-reservations": { "href": "/badminton-court/reservations", "isTemplated": false },
        "get-all-reservations-by-court": { "href": "/badminton-court/{id_court}/reservations", "isTemplated": true },
        "get-reservation-details": { "href": "/badminton-court/{id_court}/reservations/{id}", "isTemplated": true },
        "create-reservation": { "href": "/badminton-court/{id_court}/reservations", "isTemplated": true },
        "cancel-reservation": { "href": "/badminton-court/{id_court}/reservations/{id}", "isTemplated": true },
        "get-all-unavailability": { "href": "/badminton-court/unavailability", "isTemplated": false },
        "get-all-unavailability-by-court": { "href": "/badminton-court/{id_court}/unavailability", "isTemplated": true },
        "add-unavailability": { "href": "/badminton-court/{id_court}/unavailability", "isTemplated": true },
        "remove-unavailability": { "href": "/badminton-court/{id_court}/unavailability/{id}", "isTemplated": true },
        "get-auth-token": { "href": "/auth/login", "isTemplated": false },
        "create-account": { "href": "/auth/create-account", "isTemplated": false }
    }

    constructor(links = null,embedded = null,globalProperty = null) {
        this.links = (links === null) ? {} : links;
        this.embedded = (embedded === null) ? {} : embedded;
        this.globalProperty = (globalProperty === null) ? {} : globalProperty;
        return this;
    }

    render () {
        const renderHal = {
            _links : this.links,
            _embedded : this.embedded,
        };

        Object.keys(this.globalProperty).forEach(key => {
            renderHal[key] = this.globalProperty[key];
        });

        return renderHal;
    }

    addEmbedded (id,data) {
        if(typeof this.embedded[id] !== 'undefined') {
            this.embedded[id].push(data);
        } else {
            this.embedded[id] = data;
        }
        return this;
    }

    addLinks (name,href,isTemplated = false,deprecation = false) {
        this.links[name] = { href:href, templated:isTemplated , deprecation:deprecation };
        return this;
    }

    addGlobalProperty (name,value) {
        this.globalProperty[name] = value;
        return this;
    }

    addDefaultLinks ( id , self = false) {
        this.addLinks( (self) ? 'self' : id , this.#linkArray[id].href , this.#linkArray[id].isTemplated );
        return this;
    }
}

module.exports = hal;