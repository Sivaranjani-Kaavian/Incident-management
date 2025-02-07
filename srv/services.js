const cds = require('@sap/cds')

class ProcessorService extends cds.ApplicationService{
    // Registering custom event handlers
    init(){
        this.before("UPDATE","Incidents",(req) => this.onUpdate(req));
        this.before("CREATE","Incidents",(req) => this.changeUrgencyDueToSubject(req.data));

        return super.init();
    }
    changeUrgencyDueToSubject(data){
        if(data) {
            const incidents = Array.isArray(data) ?data:[data];
            incidents.forEach((incidents) => {
                if(incidents.title?.toLowerCase().includes("urgent")){
                    incidents.urgency ={code:"H" ,descr:"High"};
                }
             });
            }
        }
    // custom validation
    async onUpdate (req) {
        const { status_code} = await SELECT.one(req.subject,i => i.status_code).where({ID:req.data.ID})
        if(status_code === 'C')
            return req.reject('can`t modify an closed incident')
    }
    }
    module.exports = { ProcessorService }
