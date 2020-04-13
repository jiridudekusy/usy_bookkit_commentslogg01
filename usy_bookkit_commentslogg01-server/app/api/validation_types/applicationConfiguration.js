const applicationConfiguration = shape({
  bookUri: uri().isRequired(),
  userGroups: map(string(), shape({
    name: string(),
    identities: array(shape({
      uuIdentity: uuIdentity().isRequired(),
      name: string()
    }))
  }))
});
