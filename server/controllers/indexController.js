const EventModel = require('../models/eventModel');

const Event = new EventModel();

exports.actionIndex = async (req, res) => {
    let events = await Event.find('all');
    res.send(events);
}


exports.actionCreate = async (req, res) => {
    let 
        event  = req.body.event,
        result = false; 
    
    result = Event.save(event);

    if(result != true){
        res.status().send({status: 'fail'});
    }

    res.status(201).send({status: 'success'});
}


exports.actionDelete = async (req, res) => {
    let 
        id     = req.query.id,
        event  = {},
        result = false;
        
    if(Number(id) == undefined){
        res.status(404).send({message: 'Event has not found'});
    }

    event = await Event.findById(id);

    if(event == undefined){
        res.status(404).send({ message: 'Event has not found' });
    }

    result = await Event.removeById(event.id);

    if(result == false){
        res.status(500);
    }else{
        res.status(200).send({message: 'event was deleted success'});
    }
}