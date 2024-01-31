
const events = [
    { id: 1, title: 'Event 1', description: 'Description 1', date: '2022-01-01', time: '12:00 PM', location: 'Location 1', organizer_id: 1 },
    { id: 2, title: 'Event 2', description: 'Description 2', date: '2022-02-01', time: '03:00 PM', location: 'Location 2', organizer_id: 2 },
  ];
  

  exports.getAllEvents = (req, res) => {

    res.status(200).json(events);
  };
  

  exports.getEventById = (req, res) => {
    const eventId = parseInt(req.params.eventId);
    const event = events.find((e) => e.id === eventId);
  
    if (event) {
      res.status(200).json(event);
    } else {
      res.status(404).json({ message: 'Event not found' });
    }
  };

  exports.createEvent = (req, res) => {
    res.status(201).json({ message: 'Event created successfully.' });
  };
  

  exports.updateEvent = (req, res) => {
    const eventId = parseInt(req.params.eventId);
    res.status(200).json({ message: `Event ${eventId} updated successfully.` });
  };
  

  exports.deleteEvent = (req, res) => {
    const eventId = parseInt(req.params.eventId);
    res.status(200).json({ message: `Event ${eventId} deleted successfully.` });
  };
  