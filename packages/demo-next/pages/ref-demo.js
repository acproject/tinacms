/**

Copyright 2019 Forestry.io Inc

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

*/

import * as React from 'react'
import matter from 'gray-matter'
import { usePlugin } from 'tinacms'
import { useMarkdownForm } from 'next-tinacms-markdown'
import Layout from '../components/Layout'
import {
  InlineForm,
  InlineText,
  InlineTextarea,
  useFieldRef,
} from 'react-tinacms-inline'

const formOptions = {
  id: 'ref-demo',
  label: 'Ref Demo',
  fields: [
    {
      name: 'frontmatter.title',
      label: 'Title',
      component: 'text',
      inlineComponent: InlineText,
    },
    {
      name: 'frontmatter.subtitle',
      label: 'Subtitle',
      component: 'text',
      inlineComponent: ({ name }) => (
        <h2>
          <InlineText name={name} />
        </h2>
      ),
    },
    {
      name: 'frontmatter.description',
      label: 'Description',
      component: 'textarea',
      inlineComponent: InlineTextarea,
    },
  ],
}

function RefDemo(props) {
  const [data, form] = useMarkdownForm(props.markdownFile, formOptions)
  usePlugin(form)
  return (
    <InlineForm form={form}>
      {() => {
        const inlineTextRef = useFieldRef('frontmatter.title')
        const customInlineTextRef = useFieldRef('frontmatter.subtitle')
        const inlineTextareaRef = useFieldRef('frontmatter.description')
        return (
          <Layout>
            <section>
              <label>useFieldRef with a registered InlineText field</label>
              <hr />
              <h1 ref={inlineTextRef}>{data.frontmatter.title}</h1>
            </section>
            <hr />
            <hr />
            <section>
              <label>
                useFieldRef with a custom component that uses InlineText
              </label>
              <hr />
              <h2 ref={customInlineTextRef}>{data.frontmatter.subtitle}</h2>
            </section>
            <hr />
            <hr />
            <section>
              <label>useFieldRef with InlineTextArea</label>
              <hr />
              <div ref={inlineTextareaRef}>{data.frontmatter.description}</div>
            </section>
          </Layout>
        )
      }}
    </InlineForm>
  )
}

RefDemo.getInitialProps = async function() {
  const configData = await import(`../data/config.json`)
  const infoData = await import(`../data/ref-demo.md`)
  const data = matter(infoData.default)

  return {
    title: configData.title,
    description: configData.description,
    markdownFile: {
      fileRelativePath: `data/info.md`,
      frontmatter: data.data,
      markdownBody: data.content,
    },
  }
}

export default RefDemo