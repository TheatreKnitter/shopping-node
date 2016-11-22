// JavaScript File
var express = require('express');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

var Storage = {
  add: function(name) {
    var item = {name: name, id: this.setId};
    this.items.push(item);
    this.setId += 1;
    return item;
  },
  
  update: function(id, name) {
    var targetItem= null;
    for (var i=0; i<storage.items.length; i++){
      if (id==storage.items[i].id) {
        storage.items[i].name = name;
        targetItem= storage.items[i];
        break;
      }
    }
    
     if (targetItem== null){
       targetItem = {name: name, id: id};
       this.items.push(targetItem);
     }
     
     return targetItem;
  },
  
  delete: function(id) {
    var targetItem= null;
    for (var i=0; i<storage.items.length; i++){
      if (id==storage.items[i].id){
        targetItem= storage.items[i];
        storage.items.splice(i, 1);
        break;
      }
    }
    return targetItem;
  }
};

var createStorage = function() {
  var storage = Object.create(Storage);
  storage.items = [];
  storage.setId = 1;
  return storage;
}

var storage = createStorage();

storage.add('Broad beans');
storage.add('Tomatoes');
storage.add('Peppers');

var app = express();
app.use(express.static('public'));

app.get('/items', function(request, response) {
    response.json(storage.items);
});

app.post('/items', jsonParser, function(request, response) {
    if (!('name' in request.body)) {
        return response.sendStatus(400);
    }

    var item = storage.add(request.body.name);
    response.status(201).json(item);
});

app.delete('/items/:id', function(request, response) {
    if (!('id' in request.params)) {
        return response.sendStatus(404);
    }

    var item = storage.delete(request.params.id);
    if (item==null){
      return response.status(404).json({error: "item not found"});
    } else {
      return response.status(200).json(item);
    }
    
});

app.put('/items/:id', jsonParser, function(request, response) {
    if (!('id' in request.params)) {
        return response.sendStatus(400);
    }
    if (!('name' in request.body)) {
      return response.sendStatus(400);
    }
 
    var changeItem = storage.update(request.params.id, request.body.name);
    return response.status(200).json(changeItem);
    
});





app.listen(process.env.PORT || 8080, process.env.IP);