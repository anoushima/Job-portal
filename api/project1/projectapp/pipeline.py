def set_role(backend, user, response, *args, **kwargs):
    """Set default role for Google sign-in users"""
    if not user.role:
        user.role = 'jobseeker'
        user.save()