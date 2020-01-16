import React, { Children, useState } from 'react'
import {
  Pagination,
  PaginationItem,
  PaginationLink,
  Row,
  Col,
} from 'reactstrap'

export const DataPage = ({goToPage, goBack, goNext, children, pageNum, perPage}) => {
  const pages = {}
  let currPage = 0
  Children.forEach(children, (child)=> {
    let pageVal = pages[currPage] || []
    if(pageVal.length===perPage){
      currPage = currPage + 1
      pageVal = pages[currPage] || []
    }
    pageVal.push(child)
    pages[currPage] = pageVal
  })
  const totalPages = Object.keys(pages).length
  return (
      <div>
        <Row>
          {pages[pageNum]}
        </Row>
        <Row>
          <Col style={{display: 'flex', justifyContent: 'center'}} md={{size: 2, offset: 5}}>
            <p>{`page: ${pageNum+1} / ${totalPages}`}</p>
          </Col>
          <Col style={{display: 'flex', justifyContent: 'center'}} md={{ size: 2, offset: 5}}>
            <Pagination>
          <PaginationItem>
            <PaginationLink onClick={()=> goToPage(0)} disabled={pageNum===0}>First</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink onClick={()=> goBack()}  disabled={pageNum===0} previous />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink onClick={()=> goNext()} disabled={pageNum>=Object.keys(pages).length-1} next/>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink onClick={()=> goToPage(Object.keys(pages).length-1)} disabled={pageNum>=Object.keys(pages).length-1}>Last</PaginationLink>
          </PaginationItem>
        </Pagination>
          </Col>
        </Row>
      </div>
  )
}