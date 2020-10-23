exports.getErrorPage = (req, res, next) => {
  res.status(404).render('404', {
    pageTitle: "Error",
    path: "/error",
    isAuthenticated: req.session.isLoggedIn
  })
}