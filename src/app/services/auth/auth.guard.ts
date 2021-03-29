import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import { Store } from "@ngrx/store";
import { MessageService } from "primeng/api";
import { Observable } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { Helper } from "src/app/models/helper";
import { SystemRoles } from "src/app/models/user/system-roles";
import { User } from "src/app/models/user/user";
import { setUser } from "src/app/state/user/user.actions";
import { AuthService } from "./auth.service";

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(
        private authService: AuthService,
        private router: Router,
        private store: Store,
        private toast: MessageService
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
        return this.authService.check()
            .pipe(
                map((user: User) => {
                    if (!user) {
                        return false;
                    }

                    if(user.UserId) {
                        this.store.dispatch(setUser({ user: User.getInstance(user) }));
                    }

                    if (route.data) {
                        let allowed = true;
                        const allowRoles = route.data['allow'] as Array<SystemRoles>;
                        const rejectRoles = route.data['reject'] as Array<SystemRoles>;

                        if(allowRoles && allowRoles.length > 0) {
                            allowed = this.checkAllowedRoles(user, allowRoles);
                        }

                        if(rejectRoles && rejectRoles.length > 0) {
                            allowed = this.checkRejectedRoles(user, rejectRoles);
                        }

                        if(!allowed) {
                            this.router.parseUrl('/login');
                            return false;
                        }
                    }

                    return true;
                }),
                catchError(err => {
                    Helper.showError(this.toast, err.error.message);
                    this.router.navigate(['/login']);
                    return new Observable<boolean>(o => o.complete());
                })
            ).toPromise();
    }

    /**
     * Checks if the <code>user</code> has any of the rejected <code>roles</code>.
     *
     * @param user {@link User} The user to check.
     * @param roles {@link SystemRoles}[] The roles to check if the user has.
     * @returns <code>true</code> for allowed and <code>false</code> for rejected.
     */
    checkAllowedRoles(user: User, roles: SystemRoles[]): boolean {
        for (const role of roles) {
            if (user.hasRole(role)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Checks if the <code>user</code> has any of the rejected <code>roles</code>.
     *
     * @param user {@link User} The user to check.
     * @param roles {@link SystemRoles}[] The roles to check if the user has.
     * @returns <code>false</code> for rejected and <code>true</code> for allowed.
     */
    checkRejectedRoles(user: User, roles: SystemRoles[]): boolean {
        if (user.hasRole(SystemRoles.Admin)) {
            return true;
        }

        for (const role of roles) {
            if (user.hasRole(role)) {
                return false;
            }
        }

        return true;
    }
}
