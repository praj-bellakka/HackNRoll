  //brett m's node and express tutorial

  app.post('/api/channels', (req,res) => {
    const channelInfo = req.body;
    channelInfo.id = shortid.generate();
    channels.push(channelInfo);
    res.status(201).json(channelInfo);
  })

  app.get('/api/channels', (req, res) => {
    res.status(200).json(channels);   
  });

  app.post('/api/lessons', (req, res) => {
    const lessonInfo = req.body;
    lessonInfo.id = shortid.generate();
    lessons.push(lessonInfo);
    res.status(201).json(lessonInfo);
  })

  app.get('/api/channels/', (req, res) => {
    res.status(200).json(lessons);   
  });

  app.delete('/api/channels/:id', (req,res) => {
    const id = req.params.id;

    const deleted = channels.find(channel => channel.id === id);
    if(deleted){
      channels = channels.filter(channel => channel.id !== id)
      res.status(200).json(deleted);
    }else {
      res.status(404).json({message: "Channel you are looking for does not exist"});
    }
  });

  //end tutorial