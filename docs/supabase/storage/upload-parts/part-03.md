# Source: https://supabase.com/docs/reference/javascript/storage-from-upload
# Last fetched: 2026-03-27T18:38:37.271521+00:00

# upload — Part 3


4

.eq('name', 'violin')    // Correct

5

6

const { data, error } = await supabase

7

.from('instruments')

8

.eq('name', 'violin')    // Incorrect

9

.select('name, section_id')
```

Notes

---

## Column is equal to a value

`eq(column, value)`

Match only rows where `column` is equal to `value`.

To check if the value of `column` is NULL, you should use `.is()` instead.

### Parameters

* column

  The column to filter on
* value

  The value to filter with

### Return Type

this

With `select()`

```
1

const { data, error } = await supabase

2

.from('characters')

3

.select()

4

.eq('name', 'Leia')
```

Data source

Response

---

## Column is not equal to a value

`neq(column, value)`

Match only rows where `column` is not equal to `value`.

### Parameters

* column

  The column to filter on
* value

  The value to filter with

### Return Type

this

With `select()`

```
1

const { data, error } = await supabase

2

.from('characters')

3

.select()

4

.neq('name', 'Leia')
```

Data source

Response

---

## Column is greater than a value

`gt(column, value)`

Match only rows where `column` is greater than `value`.

### Parameters

* columnOne of the following options

  Details

  + Option 1ColumnName
  + Option 2string
* valueOne of the following options

  Details

  + Option 1Row['ColumnName']
  + Option 2unknown

### Return Type

this

With `select()`

```
1

const { data, error } = await supabase

2

.from('characters')

3

.select()

4

.gt('id', 2)
```

Data source

Response

Notes

---

## Column is greater than or equal to a value

`gte(column, value)`

Match only rows where `column` is greater than or equal to `value`.

### Parameters

* columnOne of the following options

  Details

  + Option 1ColumnName
  + Option 2string
* valueOne of the following options

  Details

  + Option 1Row['ColumnName']
  + Option 2unknown

### Return Type

this

With `select()`

```
1

const { data, error } = await supabase

2

.from('characters')

3

.select()

4

.gte('id', 2)
```

Data source

Response

---

## Column is less than a value

`lt(column, value)`

Match only rows where `column` is less than `value`.

### Parameters

* columnOne of the following options

  Details

  + Option 1ColumnName
  + Option 2string
* valueOne of the following options

  Details

  + Option 1Row['ColumnName']
  + Option 2unknown

### Return Type

this

With `select()`

```
1

const { data, error } = await supabase

2

.from('characters')

3

.select()

4

.lt('id', 2)
```

Data source

Response

---

## Column is less than or equal to a value

`lte(column, value)`

Match only rows where `column` is less than or equal to `value`.

### Parameters

* columnOne of the following options

  Details

  + Option 1ColumnName
  + Option 2string
* valueOne of the following options

  Details

  + Option 1Row['ColumnName']
  + Option 2unknown

### Return Type

this

With `select()`

```
1

const { data, error } = await supabase

2

.from('characters')

3

.select()

4

.lte('id', 2)
```

Data source

Response

---

## Column matches a pattern

`like(column, pattern)`

Match only rows where `column` matches `pattern` case-sensitively.

### Parameters

* columnOne of the following options

  Details

  + Option 1ColumnName
  + Option 2string
* patternstring

### Return Type

this

With `select()`

```
1

const { data, error } = await supabase

2

.from('characters')

3

.select()

4

.like('name', '%Lu%')
```

Data source

Response

---

## Column matches a case-insensitive pattern

`ilike(column, pattern)`

Match only rows where `column` matches `pattern` case-insensitively.

### Parameters

* columnOne of the following options

  Details

  + Option 1ColumnName
  + Option 2string
* patternstring

### Return Type

this

With `select()`

```
1

const { data, error } = await supabase

2

.from('characters')

3

.select()

4

.ilike('name', '%lu%')
```

Data source

Response

---

## Column is a value

`is(column, value)`

Match only rows where `column` IS `value`.

For non-boolean columns, this is only relevant for checking if the value of `column` is NULL by setting `value` to `null`.

For boolean columns, you can also set `value` to `true` or `false` and it will behave the same way as `.eq()`.

### Parameters

* columnOne of the following options

  Details

  + Option 1ColumnName
  + Option 2string
* valueOne of the following options

  Details

  + Option 1null
  + Option 2boolean

### Return Type

this

Checking for nullness, true or false

```
