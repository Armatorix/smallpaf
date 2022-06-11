package jira

import (
	"bytes"
	"encoding/base64"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"net/url"

	jira "github.com/andygrunwald/go-jira"
)

var errFailedStatusCode = errors.New("failed status code")

type Client struct {
	auth       string
	jiraURL    *url.URL
	jiraClient *jira.Client
}

func NewClient(user, pass string, jiraURLStr string) (*Client, error) {
	u, err := url.Parse(jiraURLStr)
	if err != nil {
		return nil, err
	}
	tp := jira.BasicAuthTransport{
		Username: user,
		Password: pass,
	}
	jiraClient, err := jira.NewClient(tp.Client(), jiraURLStr)
	if err != nil {
		return nil, err
	}
	return &Client{
		auth:       base64.StdEncoding.EncodeToString([]byte(user + ":" + pass)),
		jiraURL:    u,
		jiraClient: jiraClient,
	}, nil
}

type jiraUpdateStoryPointsRequest struct {
	Fields map[string]any `json:"fields"`
}

func (c *Client) SetTicketPoints(ticketId string, points int) error {
	reqURL := url.URL{
		Scheme: c.jiraURL.Scheme,
		Host:   c.jiraURL.Host,
		Path:   fmt.Sprintf("/rest/api/2/issue/%s", ticketId),
	}

	requestBody := jiraUpdateStoryPointsRequest{
		Fields: map[string]any{
			"customfield_10026": points,
		},
	}

	var bodyBuf bytes.Buffer
	if err := json.NewEncoder(&bodyBuf).Encode(requestBody); err != nil {
		return err
	}

	r, err := http.NewRequest(http.MethodPut, reqURL.String(), &bodyBuf)
	if err != nil {
		return err
	}
	r.Header.Add("Content-Type", "application/json")
	r.Header.Add("Authorization", "Basic "+c.auth)

	resp, err := http.DefaultClient.Do(r)
	if err != nil {
		return err
	}
	if resp != nil && resp.Body != nil {
		resp.Body.Close()
	}

	if resp.StatusCode >= 300 {
		return errFailedStatusCode
	}
	return nil
}

func (c *Client) ImportTicketsByFilter(filterId int) ([]jira.Issue, error) {
	issues, resp, err := c.jiraClient.Issue.Search(fmt.Sprintf("filter=%d", filterId), nil)
	if resp != nil && resp.Body != nil {
		defer resp.Body.Close()
	}
	if err != nil {
		return nil, err
	}

	return issues, nil
}
