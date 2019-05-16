function getDependencyVersion(packageJson, depName, field = 'dependencies') {
  const dependencies = packageJson ? packageJson[field] : null;
  const packageVersion = dependencies ? dependencies[depName] : null;

  return packageVersion;
}

module.exports = getDependencyVersion;