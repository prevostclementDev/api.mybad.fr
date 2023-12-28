const hal = require('./hal');

class CustomError {

    static errorData = {
        '400': 'Requête incorrecte. Veuillez vérifier les données fournies.',
        '401': 'Non autorisé. Veuillez vous connecter ou fournir des informations d\'authentification valides.',
        '403': 'Accès refusé. Vous n\'avez pas les autorisations nécessaires pour accéder à cette ressource.',
        '404': 'Ressource non trouvée. La page ou l\'objet que vous recherchez n\'existe pas.',
        '409': 'Conflit. La ressource que vous essayez de créer existe déjà.',
        '422': 'Erreur de validation. Assurez-vous que toutes les données requises sont fournies et correctes.',
        '500': 'Erreur interne du serveur. Veuillez réessayer ultérieurement.',
        // Ajoutez d'autres codes d'erreur au besoin
    };

    constructor(code,moreDetails = false) {
        this.code = code;
        this.message = this.constructor.errorData[code] || 'Erreur inconnue.';

        this.moreDetails = ( moreDetails !== false ) ? moreDetails : 'Nous n\'avons pas d\'information supplémentaire pour cette erreur'

        return this;
    }

    toHal(){
        return new hal()
            .addLinks('home','/')
            .addEmbedded('details', this.moreDetails )
            .addGlobalProperty('code',this.code)
            .addGlobalProperty('message',this.message)
            .addGlobalProperty('error',true);
    }

}

module.exports = CustomError;