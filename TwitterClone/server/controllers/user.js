import User from '../models/User.js';
import { handleError } from '../error.js';

export const getUser = async (req, res, next) => {
try{
    const user = await User.findById(req.params.id);
    res.status(200).json(user);
}catch(err){
    next(err);
}
};

export const updateUser = async (req, res, next) => {
    if(req.user.id === req.params.id){
        try {
            const updatedUser = await User.findByIdAndUpdate(req.params.id, 
                {$set: req.body},
                {new: true});
            res.status(200).json(updatedUser);
        } catch (err) {
            next(err);
        }
    }else{
        return next(handleError(res, 403, 'Unauthorized'));
    }
};