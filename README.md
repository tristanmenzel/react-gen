# React-Gen

An extensible file scaffolder for any web project but made with react in mind since Angular already has a great code gen tool. 

## Installation

```shell script
npm install -g @tristanwritescode/react-gen
```

## Usage

```shell script
react-gen [command] [templateNameOrShortcut] [...paths]
```

 - If command is omitted, `gen` is assumed.
 - Multiple paths can be provided to generate multiple template instances

**Create a settings file (optional)**
```shell script
react-gen init
```

**Scaffold the _functional-component_ template**
```shell script
react-gen gen functional-component components/some/path/my-component
```
_or_
```shell script
react-gen gen fc components/some/path/my-component
```
or
```shell script
react-gen fc components/some/path/my-component
```

## Configuration

Create a json file named `.react-gen` at your `package.json` level, or use the `init` command.

**Settings schema**

| Property               | Description                                                                                                                                                                                         | Default         |
|------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------|
| `basePath`             | An absolute path from the settings file for which template paths should be relative to.                                                                                                             | `"src"`         |
| `templates`            | An array of custom templates to be merged with existing templates                                                                                                                                   | _N/A_           |
| `directoryForTemplate` | Given a path `"routes/my-component"`: `true` will create a `my-component` directory and place   the template files in there, `false` will place template files directly in the `routes` directory.  | `true`          |
| `directoryCasing`      | Case conversion option for directory names. One of `kebabCase`, `camelCase`, `pascalCase`                                                                                                           | `"kebabCase"`   |
| `fileCasing`           | Case conversion option for file names. One of`kebabCase`, `camelCase`, `pascalCase`                                                                                                                 | `"pascalCase"`  |

**Template schema**

| Property   | Description                                                                                         |
|------------|-----------------------------------------------------------------------------------------------------|
| `name`     | The name of the template. If this name matches an existing template it will override that template. |
| `shortcut` | A shortcut value for the template. (Optional)                                                       |
| `files`    | An array of paths to files for this template. Can be absolute or relative to the settings file.     |

## Custom templates

**File naming**

Template files should be named `file.[ext].mustache`. The file portion will be replaced with the last segment of the provided template path.
The `.mustache` extension will be removed.

Eg. `routes/my-component` with the file name `file.tsx.mustache` will result in the file name `MyComponent.tsx` assuming the default `fileCasing` of `pascalCase`

**File template**

The templates themselves are mustache templates. The model available has the following properties. 

| Property     | Description                                                                                                |
|--------------|------------------------------------------------------------------------------------------------------------|
| `directory`  | The directory path for the template as determined by `directoryCasing` and `directoryForTemplate` settings |
| `fileName`   | The `file` portion of the file name as determined by the `fileCasing` setting.                             |
| `kebabName`  | The name of the template formatted in kebab case                                                           |
| `camelName`  | The name of the template formatted in camel case                                                           |
| `pascalName` | The name of the template formatted in pascal case                                                          |

**Example**

See [functional-component](https://github.com/tristanmenzel/react-gen/tree/master/templates/functional-component)