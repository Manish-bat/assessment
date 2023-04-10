const userModel = require('../../common/models/user.model');
const { JWT_SECRET } = require('../../common/config');
const multer = require('multer');
const jwt = require('jsonwebtoken');

const register = async ({ data }) => {
  try {
    const profileImage = data['0'];
    data = {
      profileImage,
      ...data,
    };
    const user = new userModel(data);
    await user.save();
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1d' });
    return {
      status: 'success',
      token,
    };
  } catch (e) {
    return e;
  }
};

const searchData = async ({ data }) => {
  try {
    const user = await userModel.findOne({ phoneNumber: data.phoneNumber });
    return {
      user,
    };
  } catch (e) {
    return e;
  }
};

const userLogin = async ({ data }) => {
  try {
    const { email } = data;

    const user = await userModel.findOne({ email: email });
    if (!user) {
      return {
        message: 'Invalid credentials',
      };
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1d' });

    return {
      token,
    };
  } catch (error) {
    console.log(error);
    return error;
  }
};

const updateUser = async ({ data }) => {
  try {
    const checkCredetial = await authMiddleware({ data })

    if (!checkCredetial) {
      return {
        message: 'Invalid token'
      }
    }
    const profileImage = data['0'];
    data = {
      profileImage,
      ...data,
    };

    if (!data.id) {
        return {
            message: 'id is required'
        }
    }

    const user = await userModel.findByIdAndUpdate(data.id, data, { new: true });

    console.log(user);

  } catch (error) {
    console.log(error);
    return error;
  }
};
const upload = multer({ storage: multer.memoryStorage() });

const formFileMiddleware = upload.any();

const authMiddleware = async ({ data }) => {
  try {
    const token = data.auth;
    const decodedToken = jwt.verify(token, JWT_SECRET);
    const userId = decodedToken.id;
      const user = await userModel.findById({_id: userId});
      if (!user) {
        return {
          message: 'Invalid authentication credentials'
        };
      }
        return true;
  } catch (error) {
    return {
      message: 'Invalid authentication credentials'
    };
  }
};

module.exports = {
  register,
  searchData,
  userLogin,
  updateUser,
  formFileMiddleware,
  authMiddleware
};
