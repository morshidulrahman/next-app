"use client";
import React, {
  useRef,
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";

const RichCommentInput = forwardRef(
  ({ value, onChange, placeholder, disabled, mentionedUsers = [] }, ref) => {
    const editableRef = useRef(null);
    const [isComposing, setIsComposing] = useState(false);

    // Expose methods to parent component
    useImperativeHandle(ref, () => ({
      focus: () => {
        if (editableRef.current) {
          editableRef.current.focus();
        }
      },
      setSelectionRange: (start, end) => {
        if (editableRef.current) {
          // For contentEditable, we need to set the cursor position differently
          const range = document.createRange();
          const sel = window.getSelection();

          try {
            // Convert character position to DOM position
            const textContent = getPlainTextFromHTML(
              editableRef.current.innerHTML
            );
            const targetPosition = Math.min(start, textContent.length);

            // Find the text node and position
            let currentPos = 0;
            let targetNode = null;
            let targetOffset = 0;

            const walker = document.createTreeWalker(
              editableRef.current,
              NodeFilter.SHOW_TEXT,
              null,
              false
            );

            let node;
            while ((node = walker.nextNode())) {
              const nodeLength = node.textContent.length;
              if (currentPos + nodeLength >= targetPosition) {
                targetNode = node;
                targetOffset = targetPosition - currentPos;
                break;
              }
              currentPos += nodeLength;
            }

            if (targetNode) {
              range.setStart(targetNode, targetOffset);
              range.setEnd(targetNode, targetOffset);
              sel.removeAllRanges();
              sel.addRange(range);
            } else {
              // Fallback: set cursor at the end
              range.selectNodeContents(editableRef.current);
              range.collapse(false);
              sel.removeAllRanges();
              sel.addRange(range);
            }
          } catch (e) {
            console.warn("Could not set cursor position:", e);
            // Fallback: just focus
            editableRef.current.focus();
          }
        }
      },
    }));

    // Convert plain text with @mentions to HTML
    const convertTextToHTML = (text) => {
      if (!text) return "";

      const mentionRegex = /@(\w+)/g;
      let lastIndex = 0;
      let html = "";
      let match;

      while ((match = mentionRegex.exec(text)) !== null) {
        // Add text before mention
        html += escapeHtml(text.slice(lastIndex, match.index));

        const username = match[1];
        const mentionedUser = mentionedUsers.find(
          (user) => user.username === username
        );

        if (mentionedUser) {
          html += `<span class="mention-link" data-username="${username}">@${username}</span>`;
        } else {
          html += `<span class="mention-typing">@${username}</span>`;
        }

        lastIndex = match.index + match[0].length;
      }

      html += escapeHtml(text.slice(lastIndex));
      html = html.replace(/\n/g, "<br>");

      return html;
    };

    // Escape HTML characters
    const escapeHtml = (text) => {
      const div = document.createElement("div");
      div.textContent = text;
      return div.innerHTML;
    };

    // Get plain text from HTML content
    const getPlainTextFromHTML = (html) => {
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = html;

      const mentionSpans = tempDiv.querySelectorAll(
        ".mention-link, .mention-typing"
      );
      mentionSpans.forEach((span) => {
        const username =
          span.getAttribute("data-username") ||
          span.textContent.replace("@", "");
        span.replaceWith(`@${username}`);
      });

      tempDiv.innerHTML = tempDiv.innerHTML.replace(/<br\s*\/?>/gi, "\n");
      return tempDiv.textContent || tempDiv.innerText || "";
    };

    // Get current caret position
    const getCaretPosition = () => {
      if (!editableRef.current) return 0;

      const selection = window.getSelection();
      if (selection.rangeCount === 0) return 0;

      const range = selection.getRangeAt(0);
      const preCaretRange = range.cloneRange();
      preCaretRange.selectNodeContents(editableRef.current);
      preCaretRange.setEnd(range.endContainer, range.endOffset);

      return getPlainTextFromHTML(preCaretRange.toString()).length;
    };

    // Update content when value changes
    useEffect(() => {
      if (editableRef.current && !isComposing) {
        const currentPlainText = getPlainTextFromHTML(
          editableRef.current.innerHTML
        );

        if (currentPlainText !== value) {
          const html = convertTextToHTML(value);
          editableRef.current.innerHTML = html;

          // Restore cursor position
          if (value.length > 0) {
            const range = document.createRange();
            const sel = window.getSelection();

            try {
              range.selectNodeContents(editableRef.current);
              range.collapse(false);
              sel.removeAllRanges();
              sel.addRange(range);
            } catch (e) {
              console.warn("Could not restore cursor position:", e);
            }
          }
        }
      }
    }, [value, mentionedUsers, isComposing]);

    // Handle input changes
    const handleInput = (e) => {
      if (onChange && !isComposing) {
        const plainText = getPlainTextFromHTML(e.target.innerHTML);
        onChange({
          target: {
            value: plainText,
            selectionStart: getCaretPosition(),
          },
        });
      }
    };

    // Handle mention clicks
    const handleClick = (e) => {
      if (e.target.classList.contains("mention-link")) {
        e.preventDefault();
        const username = e.target.getAttribute("data-username");
        if (username) {
          // Open in new tab
          window.open(
            `/dashboard/user/${username}`,
            "_blank",
            "noopener,noreferrer"
          );
        }
      }
    };

    // Handle composition events
    const handleCompositionStart = () => setIsComposing(true);
    const handleCompositionEnd = (e) => {
      setIsComposing(false);
      handleInput(e);
    };

    // Handle paste events
    const handlePaste = (e) => {
      e.preventDefault();
      const text = e.clipboardData.getData("text/plain");
      document.execCommand("insertText", false, text);
    };

    return (
      <div
        ref={editableRef}
        contentEditable={!disabled}
        suppressContentEditableWarning={true}
        className="rich-comment-input"
        onInput={handleInput}
        onClick={handleClick}
        onCompositionStart={handleCompositionStart}
        onCompositionEnd={handleCompositionEnd}
        onPaste={handlePaste}
        data-placeholder={placeholder}
        role="textbox"
        aria-multiline="true"
      />
    );
  }
);

RichCommentInput.displayName = "RichCommentInput";

export default RichCommentInput;
