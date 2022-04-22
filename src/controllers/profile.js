const { profile, user } = require('../../models');

exports.getProfile = async (req, res) => {
  try {
    const idUser = req.user.id;
   
    let data = await profile.findOne({
      where: {
        idUser,
      },
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'idUser'],
      },
    });

    data = JSON.parse(JSON.stringify(data));

    data = {
      ...data,
      image: data ? process.env.PATH_FILE + data.image : null,
    };

    res.send({
      status: 'success...',
      data,
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: 'failed',
      message: 'Server Error',
    });
  }
};

exports.getProfileId = async (req, res) => {
  try {
    const { id } = req.params;
   
    let data = await profile.findOne({
      where: {
        id,
      },
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'idUser'],
      },
    });

    data = JSON.parse(JSON.stringify(data));

    data = {
      ...data,
      image: data ? process.env.PATH_FILE + data.image : null,
    };

    res.send({
      status: 'success...',
      data,
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: 'failed',
      message: 'Server Error',
    });
  }
};

exports.addProfile = async (req, res) => {
  try {
    
    const data = {
      phone: req.body.phone,
      gender: req.body.gender,
      address: req.body.address,
      image: req.file.filename,
      idUser: req.user.id,
    };

    let newProfile = await profile.create(data);

    let profileData = await profile.findOne({
      where: {
        id: newProfile.id,
      },
      include: 
        {
          model: user,
          as: 'user',
          attributes: {
            exclude: ['createdAt', 'updatedAt', 'password'],
          },
        },
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'idUser'],
      },
    });
    profileData = JSON.parse(JSON.stringify( profileData));

    res.send({
      status: 'success...',
      data: {
        ... profileData,
        image: process.env.PATH_FILE +  profileData.image,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: 'failed',
      message: 'Server Error',
    });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { id } = req.params;

    const data = {
      gender: req?.body?.gender,
      address: req?.body.address,
      phone: req?.body?.phone,
      image: req?.file?.filename,
      idUser: req?.user?.id,
    };

    await profile.update(data, {
      where: {
        id,
      },
    });

    res.send({
      status: 'success',
      data: {
        id,
        data,
        image: req?.file?.filename,
      },
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: 'failed',
      message: 'Server Error',
    });
  }
};