const mongoose = require('mongoose')


DB = 'mongodb+srv://xadmin:KuKMYK8C3Vi9oYNR@cluster0.0kwwtqx.mongodb.net/mernstack?retryWrites=true&w=majority'
mongoose.connect(DB).then(()=>{
    console.log('database connected')
}).catch((err)=>{
    console.log('database not connected', err)
})