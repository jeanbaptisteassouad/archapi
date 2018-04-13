



const send = (status,fn_name,env,res) =>
  res.status(status).send({fn_name,env})


module.exports = {
  send
}

