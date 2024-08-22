const allowUser = userRole => {
    return (req, res, next) => {
        try {
            const loggedInUser = req.authUser || null
            if (!loggedInUser) {
                throw { status: 401, message: 'Login required' }
            }
            if (loggedInUser.role === 'admin') {
                next()
            } else {
                if ((typeof userRole === 'string' && userRole === loggedInUser.role)
                    || (Array.isArray(userRole) && userRole.includes(loggedInUser.role))) {
                    next();
                }
                else {
                    throw { status: 403, message: 'Unauthorized access' }
                }
            }

        } catch (error) {
            next(error)
        }
    }
}
export default allowUser;