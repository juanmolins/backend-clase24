// config/passportConfig.js
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import User from '../dao/models/userModel.js'
import bcrypt from 'bcrypt';

export function configurePassport(){
    // Configuración de la estrategia local
    passport.use(new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password',
      }, async (username, password, done) => {
        try {
          const user = await User.findOne({ username });
      
          if (!user) {
            return done(null, false, { message: 'Nombre de usuario incorrecto.' });
          }
      
          const isPasswordValid = await bcrypt.compare(password, user.password);
      
          if (!isPasswordValid) {
            return done(null, false, { message: 'Contraseña incorrecta.' });
          }
      
          return done(null, user);
        } catch (err) {
          return done(err);
        }
      }));

    // Configuración de la estrategia JWT
    const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
    ]),
    secretOrKey: 'tu-clave-secreta',
    };

    passport.use(new JwtStrategy(jwtOptions, async (payload, done) => {
    try {
        const user = await User.findById(payload.sub);
        if (!user) {
        return done(null, false);
        }
        return done(null, user);
    } catch (error) {
        return done(error, false);
    }
    }));
}