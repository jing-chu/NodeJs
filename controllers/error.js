exports.getErrorPage = (req, res, next) => {
  res.status(404).render('errorPage', {
    pageTitle: "Error",
    path: "/error"
  })
}