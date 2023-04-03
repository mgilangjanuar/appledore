---
title: Under the Hood of gptcommit
published_at: 2023-04-03T08:56:00.000+07:00
excerpt: gptcommit is a tool that I made to help me commit my changes to my git repository. I made this tool because I'm lazy to describe my changes in the commit message. With...
image: /images/img-ZVbPvrbqBttbJTGEkeCQfWBj.png
language: en
reading_time: 9 mins
tags:
  - Engineering
---

[gptcommit](https://github.com/mgilangjanuar/gptcommit) is a tool that I made to help me commit my changes to my git repository. I made this tool because I'm lazy to describe my changes in the commit message. With the capability of generative AI models like GPT that developed by [OpenAI](https://openai.com/), I can generate a commit message based on my changes.

For the technology stack, I use [Node.js](https://nodejs.org/en/) as the main language with [TypeScript](https://www.typescriptlang.org/) as the superset.

### Dependencies

As a CLI-based application, we need to install the dependencies that support the command parser from the user, loading indicator, receiving the user input, etc. So, I choose the following dependencies:

  * [commander @^10.0.0](https://github.com/tj/commander.js)

    The complete solution for node.js command-line interfaces. I use this as a backbone for gptcommit. It helps me to parse the command from the user and runs the action.

  * [inquirer @^9.1.4](https://github.com/SBoudrias/Inquirer.js)

    A collection of common interactive command line user interfaces. I use this to ask the user for the confirmation of the commit message, edit the commit message, and etc.

  * [ora @^6.1.2](https://github.com/SBoudrias/Inquirer.js)

    Elegant terminal spinner. I use this to show the loading indicator when the commit message is being generated.

  * [figlet @^1.5.2](https://github.com/patorjk/figlet.js)

    A FIG driver implementation for node.js. I use this to show the ASCII art of gptcommit in the terminal. Not really necessary, but it's fun.

  * [axios @^1.3.4](https://github.com/axios/axios)

    Promise based HTTP client for the browser and node.js. I use this to send the request to the OpenAI API.

  * [configstore @^6.0.0](https://github.com/yeoman/configstore)

    Easily load and persist config without having to think about where and how. I use this to store the user's OpenAI API key.

### Main idea

The main idea of gptcommit is to generate a commit message based on the changes that the user made by using the OpenAI API. We don't want to use an API key for everyone, so we need to create a command that can store the API key of the user locally.

Then, we can get the changes from the project that use git as the version control system by using the `git diff` command. After that, we can send the changes to the OpenAI API to generate the commit message. Finally, we can commit the changes to the git repository with the generated commit message.

Here is the simple flowchart of the main idea:

[![simple flowchart](/images/d1c74073-c661-41ca-88f2-81c5c8ff0b3f.png)](/images/d1c74073-c661-41ca-88f2-81c5c8ff0b3f.png)

### Challenges

There are some challenges that I face when I'm developing gptcommit after have the main idea. Here are some of them:

  * **How to get the diff strings?**

    Simply run the command:

    ```bash
    git diff
    ```

    We can call it with `exec` or `execSync` from package [`child_process`](https://nodejs.org/api/child_process.html).

    And, for simple use and straightforward use, we can add the files before it.

    ```typescript
    const filesDiff = (files?.length ? files : ['.']).join(' ')
    const diffString = execSync(`git add ${filesDiff} && git diff --staged`)
                      .toString()
    ```

  * **How to commit the changes with long and multiline diff strings?**

    The results from the OpenAI request maybe will have multiple lines or a long message. So this is how I commit the changes with that generated commit message:

    ```typescript
    execSync(`printf "${commitMessage.replace(/\`/gi, '\\\`')}" | git commit -F-`)
    ```

    We can use the `-F` flag to receive the file of the commit message that produced by the `printf` command. For note, the string in the `printf` command can't contains the apostrophe character.

  * **What the prompt should be?**

    The messages object that we send to the OpenAI API has a structure that we can utilize as a commit message generator. Here is the example of messages:

    ```json
    [
      {"role": "system", "content": "You are a helpful assistant."},
      {"role": "user", "content": "Who won the world series in 2020?"},
      {"role": "assistant", "content": "The Los Angeles Dodgers won the World Series in 2020."},
      {"role": "user", "content": "Where was it played?"}
    ]
    ```

    As you can see, messages is an array of message object. It has a role as a system, user, or assistant.

    So, my solution is to build the message content for the system role like this:

    ```text
    You are a commit message generator by creating a commit message with the diff strings. Here is the format of good commit message:

    ---
    <type>(<scope>): <subject>
    <BLANK LINE>
    <body>
    ---

    With allowed <type> values are feat, fix, perf, docs, style, refactor, test, and build. And here's an example of a good commit message:

    ---
    fix(middleware): ensure Range headers adhere more closely to RFC 2616

    Add one new dependency, use `range-parser` (Express dependency) to compute range. It is more well-tested in the wild.
    ---
    ```

    Or, in the JSON format:

    ```json
    [
      {"role":"system","content":"You are a commit message generator by creating a commit message with the diff strings. Here is the format of good commit message:\\n---\\n<type>(<scope>): <subject>\\n<BLANK LINE>\\n<body>\\n---\\nWith allowed <type> values are feat, fix, perf, docs, style, refactor, test, and build. And here\'s an example of a good commit message:\\n---\\nfix(middleware): ensure Range headers adhere more closely to RFC 2616\\nAdd one new dependency, use `range-parser` (Express dependency) to compute range. It is more well-tested in the wild.\\n---"}
      {"role":"user","content":"---INPUT THE DIFF STRINGS HERE---"}
    ]
    ```

    That prompt message is not perfect, but it's a good start. I still need to improve it to make it more accurate.

  * **How to regenerate the commit message?**

    Sometimes, the first generated commit message is not good enough and we can't control the result from the OpenAI. So, we need to give the user a chance to regenerate the commit message. I use the `inquirer` package to ask the user for confirmation of the commit message. Here is the code snippet to solve it:

    ```typescript
    let commitMessage: string
    let isDone: boolean = false

    while (!isDone) {
      const diffStrings = await getDiffStrings()
      commitMessage = await requestToOpenAI(diffStrings)

      console.log(
        `Successfully generated a commit message:\n---\n${commitMessage}\n---`)

      const { confirm } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'confirm',
          message: 'Generate a new commit message?',
          default: false
        }
      ])

      if (!confirm) {
        isDone = true
      }
    }

    await commitChanges(commitMessage)
    await pushToRepo()
    ```

    Yes, we can solve that problem with only a `while` block and `isDone` as a flag.

    And for enhancing the capability of chat completion from the OpenAI API, I enable the user conversation with the assistant. Here is the enhancement of that code:

    ```typescript
    /**
     * // update the requestToOpenAI function
     */
    const requestToOpenAI = async (diffStrings: string, msg: { role: string, content: string }[] = []) => {
      const messages = msg.length ? msg : [
        {
          role: 'system',
          content: 'You are a commit message generator...'    // use the prompt message
        },
        {
          role: 'user',
          content: diffStrings
        }
      ]

      const { data } = await axios.post(/** Follow the API ref: https://platform.openai.com/docs/api-reference/chat/create */)

      messages.push(data.choices[0].message)
      return messages   // return the messages array
    }

    /**
     * // update the main script
     */
    let messages: { role: string, content: string }[] = []
    while (!isDone) {
      const diffStrings = await getDiffStrings()
      messages = await requestToOpenAI(diffStrings, messages)
      commitMessage = messages.at(-1).content

      // ...same as before

      if (!confirm) {
        isDone = true
      } else {
        const { prompt } = await inquirer.prompt([
          {
            type: 'input',
            name: 'prompt',
            message: 'Any context or instruction you want to add?',
            default: ''
          }
        ])
        if (prompt) {
          messages.push({
            role: 'user',
            content: prompt
          })
        } else {
          messages.pop()
        }
      }
    }
    ```

    The script will be waiting for the user input as a prompt and append that as a message to the `messages` array. If it is not provided by the user, it will remove the result message from the previous message and regenerate the commit message.

  * **How to edit the commit message before commit the changes?**

    Again, it can be solved with the `inquirer` package. Here is the snippet of code:

    ```typescript
    const { edit } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'edit',
        message: 'Do you want to edit this commit message?',
        default: false
      }
    ])

    if (edit) {
      const { message } = await inquirer.prompt([
        {
          type: 'editor',
          name: 'message',
          message: 'Edit your commit message',
          default: commitMessage
        }
      ])
      commitMessage = message
    }

    await commitChanges(commitMessage)
    await pushToRepo()
    ```

    It will launch the text editor such as vim or nano to edit the previously generated commit message.

  * **How to handle the big changes?**

    As we know, the OpenAI model only has 4,096 max tokens for the `gpt-3.5-turbo` and 8,192 for the `gpt-4` models. And we can't control the results from the `git diff` command for the message content to the OpenAI API. So, my ideas are:

    1. *Adding the `--files <files...>` option*

        By adding that option, users can select which files or folders to be committed. Here is an example of the user command:

        ```bash
        gptcommit --file web/src web/public
        ```

    2. *Chunking the diff*

        This solution is very tricky, we can automatically chunk the diff by a recursive call to the main function. Here is the code:

        ```typescript
        /**
         * // update the getDiffStrings function
         */
        async function getDiffStrings(files: string[] = []) {
          const filesDiff = (files?.length ? files : ['.']).join(' ')
          return execSync(`git add ${filesDiff} && git diff --staged`)
                  .toString()
        }

        /**
         * // add the chunking function
         */
        async function chunking(files: string[]): Promise<string[]> => {
          const messages = [
            {
              role: 'system',
              content: 'Response with array of folder or file name that determined the scope of changes from the git status. Please only answer with the parseable json array of string only!'
            },
            {
              role: 'user',
              content: execSync(`git status ${files.join(' ')}`).toString()
            }
          ]
          const { data } = await axios.post(/** Follow the API ref: https://platform.openai.com/docs/api-reference/chat/create */)

          // parse the response to the array of string
          return JSON.parse(data.choices[0].message.content) as string[]
        }

        /**
         * // update the main function
         */
        async function commit({ files = ['.'] }) {
          let commitMessage: string
          let isDone: boolean = false
          let messages: { role: string, content: string }[] = []

          while (!isDone) {
            const diffStrings = await getDiffStrings(files)
            try {
              messages = await requestToOpenAI(diffStrings, messages)
              commitMessage = messages.at(-1).content
            } catch (error) {
              if (isAxiosError(error)) {
                // parse the error to the AxiosError
                const err = error as AxiosError<{ error: { code: string } }>
                if (err.response.status === 400 && err.response.data.error.code === 'context_length_exceeded')  {

                  // ask user to chunk the files
                  const { chunk } = await inquirer.prompt([
                    {
                      type: 'confirm',
                      name: 'chunk',
                      message: `Do you want to chunk the files ${JSON.stringify(files)}?`,
                      default: true
                    }
                  ])

                  if (!chunk) return

                  const chunks = await chunking(files)
                  for (const [i, chunk] of chunks.entries()) {
                    // recall the commit function with the chunked files
                    await commit({ files: [chunk] })
                  }
                  isDone = true
                }
              } else {
                return
              }
            }

            // continue the script same as before
        }
        ```

        The script will be chunking the files by asking the user for confirmation and then requesting the OpenAI API again to get the chunked files. Then, it will recall the main function with the chunked files.

  * **How to packaging the build scripts?**

    I need to publish the package to the NPM registry and [Homebrew](https://brew.sh) to easily install the package. Here are my solutions:

    1. *Publishing to the NPM registry*

        Simply run the command:

        ```bash
        yarn publish
        ```

        If, I need to upgrade the package version, I can run the command:

        ```bash
        yarn version --patch
        yarn build    # it's necessary to build the ts project
        yarn publish
        ```

    2. *Publishing to the Homebrew*

        First, I need to make a project into a single execution file. We can use the [ncc](https://github.com/vercel/ncc) package from Vercel. Here is the command:

        ```bash
        ncc build -o ./build ./index.js
        ```

        It will create a `build` directory from the `index.js` file as an entry point.

        Then, create an executable application. I use the [pkg](https://github.com/vercel/pkg) package from Vercel. Here is the command:

        ```bash
        pkg package.json
        ```

        All that packages are not supported by an ESM module, so I need to modify the build scripts in the `dist` directory to the CommonJS module. The solution is very tricky, I need to add more package.json file first to support the CommonJS module. Here is the content:

        ```json
        {
          "name": "gptcommit",
          "bin": {
            "gptcommit": "./index.js"
          },
          "pkg": {
            "scripts": "./index.js",
            "assets": [
              "./fonts/*"
            ]
          }
        }
        ```

        Save it to `package.pkg.json`.

        Then, I need to modify the `build` results in the `dist/**/*.mjs` files. Here is the command:

        ```bash
        find dist/ -depth -name \"*.mjs\" -exec sh -c 'mv \"$1\" \"${1%.mjs}.js\"' _ {} \\; && \
        find dist -type f -print0 | xargs -0 sed -i '' 's/\\.mjs//g'
        ```

        For the full command:

        ```bash
        find dist/ -depth -name \"*.mjs\" -exec sh -c 'mv \"$1\" \"${1%.mjs}.js\"' _ {} \\; && \
        find dist -type f -print0 | xargs -0 sed -i '' 's/\\.mjs//g' && \
        cp ./package.pkg.json ./dist/package.json && \
        cd dist && \
        ncc build -o ./build ./index.js && \
        cp ../package.pkg.json ./build/package.json && \
        cd ./build && \
        pkg package.json && \
        mv gptcommit-macos gptcommit && \
        tar -czf gptcommit.tar.gz gptcommit && \
        shasum -a 256 gptcommit.tar.gz
        ```

        Yes, we need to create a tarball file and shasum for the Homebrew formula.

        Then, we need to create a release in the GitHub repository with the tarball file as an asset.

        Next, create a new repository for the Homebrew formula. Here is the repository: [homebrew-gptcommit](https://github.com/mgilangjanuar/homebrew-gptcommit). With the directory structure:

        ```bash
        .
        ├── Formula
        │   └── gptcommit.rb
        └── README.md
        ```

        The `gptcommit.rb` file is the formula for the Homebrew. Here is the content:

        ```ruby
        class Gptcommit < Formula
          desc "gptcommit is a tool to help you commit your changes to a git repository with ChatGPT API"
          homepage "https://github.com/mgilangjanuar/gptcommit"
          url "https://github.com/mgilangjanuar/gptcommit/releases/download/v0.1.27/gptcommit.tar.gz"
          sha256 "ccb7f1967eae59ac3f6466225cd2a73b66d16969862385e464eeb30d88592c01"
          license "MIT"
          version "0.1.27"

          def install
            bin.install "gptcommit"
          end
        end
        ```

        Note, the `url`, `version`, and the `sha256` must be updated manually every time we release a new version.

        Then, users can install the package with the command:

        ```bash
        brew tap mgilangjanuar/gptcommit && \
        brew install gptcommit
        ```

        And if any update is available, users can upgrade the package with the command:

        ```bash
        brew update && \
        brew upgrade gptcommit
        ```

---

It's a wrap! 🎉

Please note that the code above is not the final version of the script. But, I show it to you for reference. You can find the final version of the script in the [GitHub repository](https://github.com/mgilangjanuar/gptcommit). And for sure, you can install the package with the command:

```bash
brew tap mgilangjanuar/gptcommit && \
brew install gptcommit
```

Or, with the NPM package:

```bash
npm install -g gptcommit
```