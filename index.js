var eejs = require('ep_etherpad-lite/node/eejs')

/*
* Handle incoming delete requests from clients
*/
exports.handleMessage = function(hook_name, context, callback){
  var Pad = require('ep_etherpad-lite/node/db/Pad.js').Pad

  // Firstly ignore any request that aren't about chat
  var isDeleteRequest = false;
  if(context) {
    if(context.message && context.message){
      if(context.message.type === 'COLLABROOM'){
        if(context.message.data){
          if(context.message.data.type){
            if(context.message.data.type === 'ep_push2delete'){
              isDeleteRequest = true;
            }
          }
        }
      }
    }
  }
  if(!isDeleteRequest){
    return callback(false);
  }
  
  var packet = context.message.data;
  /***
    What's available in a packet?
    * action -- The action IE chatPosition
    * padId -- The padId of the pad both authors are on
    ***/
  if(packet.action === 'deletePad'){
    var pad = new Pad(packet.padId)
    pad.remove(function(er) {
      if(er) console.warn('ep_push2delete', er)
      callback([null]);
    })
  }
}

exports.eejsBlock_mySettings = function(hook_name, args, cb) {
  return cb();
};

exports.eejsBlock_mySettings.dropdowns = function(hook_name, args, cb) {
  let hiddenState = "display: inline !important;";
  const ejsPath = 'ep_push2delete/templates/delete_button.ejs';
  args.content += eejs.require(ejsPath, {hidden: hiddenState});
  return cb();
};

