import { HttpClient, HttpInterceptor} from '@angular/common/http'
import { AuthService } from './auth.service'
import { Injectable } from '@angular/core'

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
    
    constructor(private auth: AuthService) {}
    
    intercept(req, next) {
        var authRequest = req.clone({
            headers: req.headers.set('Authorization', 'token ' + this.auth.token)
        })
        return next.handle(authRequest)
    }
}