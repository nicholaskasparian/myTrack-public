# Source: https://supabase.com/docs/guides/ai/examples/nextjs-vector-search
# Last fetched: 2026-03-27T18:38:37.271521+00:00

# nextjs — Part 2


async (query: string) => {

3

setAnswer(undefined)

4

setQuestion(query)

5

setSearch('')

6

dispatchPromptData({ index: promptIndex, answer: undefined, query })

7

setHasError(false)

8

setIsLoading(true)

9

10

const eventSource = new SSE(`api/vector-search`, {

11

headers: {

12

apikey: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? '',

13

Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY}`,

14

'Content-Type': 'application/json',

15

},

16

payload: JSON.stringify({ query }),

17

})

18

19

function handleError<T>(err: T) {

20

setIsLoading(false)

21

setHasError(true)

22

console.error(err)

23

}

24

25

eventSource.addEventListener('error', handleError)

26

eventSource.addEventListener('message', (e: any) => {

27

try {

28

setIsLoading(false)

29

30

if (e.data === '[DONE]') {

31

setPromptIndex((x) => {

32

return x + 1

33

})

34

return

35

}

36

37

const completionResponse: CreateCompletionResponse = JSON.parse(e.data)

38

const text = completionResponse.choices[0].text

39

40

setAnswer((answer) => {

41

const currentAnswer = answer ?? ''

42

43

dispatchPromptData({

44

index: promptIndex,

45

answer: currentAnswer + text,

46

})

47

48

return (answer ?? '') + text

49

})

50

} catch (err) {

51

handleError(err)

52

}

53

})

54

55

eventSource.stream()

56

57

eventSourceRef.current = eventSource

58

59

setIsLoading(true)

60

},

61

[promptIndex, promptData]

62

)
```

## Learn more[#](#learn-more)

Want to learn more about the awesome tech that is powering this?

* Read about how we built [ChatGPT for the Supabase Docs](/blog/chatgpt-supabase-docs).
* Read the pgvector Docs for [Embeddings and vector similarity](/docs/guides/database/extensions/pgvector)
* Watch Greg's video for a full breakdown:

Watch video guide

![Video guide preview](/docs/_next/image?url=https%3A%2F%2Fimg.youtube.com%2Fvi%2FxmfNUCjszh4%2F0.jpg&w=3840&q=75)

### Is this helpful?

No  Yes

### AI Tools

Copy as Markdown[Ask ChatGPT](https://chatgpt.com/?hint=search&q=Read from https://supabase.com/docs/guides/ai/examples/nextjs-vector-search so I can ask questions about its contents)[Ask Claude](https://claude.ai/new?q=Read from https://supabase.com/docs/guides/ai/examples/nextjs-vector-search so I can ask questions about its contents)
