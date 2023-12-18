import User from "../model/user.model.js";

const createUser = async ({fullName, email, password, avatarFile}) => {
  try {
    const user = await User.create({
      fullName,
      email,
      password,
      avatar: {
        public_id: email,
        secure_url:
          "https://as2.ftcdn.net/v2/jpg/05/11/55/91/1000_F_511559113_UTxNAE1EP40z1qZ8hIzGNrB0LwqwjruK.jpg",
      },
    });

    if (!user) {
      new Error("User registeration failed, please try again", 400);
    }

    //todo: upload user picture
    if (avatarFile) {
      try {
        const result = await cloudinary.v2.uploader.upload(req.file.path, {
          folder: "lms",
          width: 250,
          height: 250,
          gravity: "faces",
          crop: "fill",
        });
        if (result) {
          user.avatar.public_id = result.public_id;
          user.avatar.secure_url = result.secure_url;
          // * remove the file from local server
          fs.rm(`uploads/${req.file.filename}`);
        }
      } catch (error) {
        throw new Error(error.message || "File not uploaded, please try again", 400);
      }
    }

    await user.save();

    return user;
  } catch (error) {
    throw error;
  }
};


export {
    createUser,
}