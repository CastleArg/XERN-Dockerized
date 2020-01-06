import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken'
import {customResponse} from '../apiRoutes/routes'
import User, {IUser} from '../models/users'
import {registerValidation, loginValidation, userValidation} from '../helpers/validateUsers'
import config from '../settings/config'
import checkPermissions from './checkPermissions'


export interface IPayload {

    user: string,
    iat: number
}

export const checkUpdateUser = async(req: Request, res: Response, next: NextFunction) => {

    //console.log(req.body, "DATA USER TO MODIFY")    
    const { error } = await userValidation(req.body);    
    if (error) {
        console.log(error, "ERROR GETTING UPDATE")
        return res.status(400).send(customResponse('Invalid Data', error));
    }

    try {
    //console.log(req, "REQUIRES FROM  PERMISSIONS")  
        
    const { role, active, password, passwordConfirmation } = req.body
    const rawdata = {role, active, password}
    
    Object.keys(rawdata).forEach((key) => 
    (rawdata[key] === null || rawdata[key] === undefined) && delete rawdata[key]);
    
    //console.log(rawdata, "CLEAN DATA")
    if(!rawdata.password){
        
        req.body.rawdata = rawdata
        //console.log(req.body.rawdata, "PARA ENVIAR A UPDATEAR USER")        
        console.log(req.body.rawdata, "DATa TO MODIFY ADMIN ROLE")        
        checkPermissions(req, res, next)
    }
    else if(rawdata.password === passwordConfirmation){

        console.log(rawdata.password, "PASSWORD TO CHANGE")
        const usermod: IUser = new User({
            password: rawdata.password        
        })
        await usermod.encryptPassword(rawdata.password)
        .then( (encryptedPass) =>{
            //console.log(encryptedPass, "ENCRYPTED FOR UPDATE")
            rawdata.password = encryptedPass}
        )
        .catch(error =>
            console.log(error, "ERROR ENCRYPTING PASSWORD")            
        )
        //console.log("MODIFYING ENCRYPTED PASSWORD")
        req.body.rawdata = rawdata
        next()
    }
    else{
        console.log(error, "error updating user")
        res.status(401).send(customResponse('Error passwords doesnt match', error.name))
    }

    

    } 
    catch (error) {
        console.log(error, "error updating user")
        res.status(401).send(customResponse('Error Updating User', error.name))
    }      
}

