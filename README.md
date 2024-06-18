# LangChain-DSM-V

LangChain-DSM-V is an ChatBot that knows DSM-V.

## Quick Start

Clone this repositories using Git:

```sh
git clone https://github.com/eeviriyi/LangChain-DSM-V.git
```

Install the requirements：

```sh
pip install -r requirements.txt
```

Set up the environment variables:

```
export LANGCHAIN_PROJECT=default
export OPENAI_API_KEY="YOUR_OPENAI_API_KEY"
```

If you want to use LangSmith:

```
export LANGCHAIN_TRACING_V2=true
export LANGCHAIN_API_KEY="YOUR_LANGCHIAN"
```

You can also create `.env` file:

```
LANGCHAIN_PROJECT=default
OPENAI_API_KEY="YOUR_OPENAI_API_KEY"

LANGCHAIN_TRACING_V2=true
LANGCHAIN_API_KEY="YOUR_LANGCHIAN"
```

Run the `main.py` using Python:

```sh
python ./main
```

Open http://127.0.0.1:7860 on your browser

## File-tree

```
├───📁 MSDENProfessionalMedicalTopics/
├───📁 MSDZHProfessionalMedicalTopics/
├───📄 .gitignore
├───📄 README.md
├───📄 dsm-5.txt
├───📄 main.py
└───📄 requirements.txt
```

## Contributing

https://github.com/lwd-temp/MSD-Manual-Portable

https://github.com/langchain-ai/langchain

## License

MIT
