//
//  noteCell.swift
//  AddressBook
//
//  Created by Robert Swanson on 5/4/19.
//  Copyright © 2019 Robert Swanson. All rights reserved.
//

import UIKit

class noteCell: UITableViewCell, UITextViewDelegate{
    
    @IBOutlet weak var label: UITextView!
    var detail: DetailViewController?
    
    override func layoutSubviews() {
        label.delegate = self
    }
    
    func textViewDidEndEditing(_ textView: UITextView) {
        print(textView.text ?? "")
        detail?.masterViewController!.updateRow(id: (detail!.row?[detail!.masterViewController!.contactIdPK])!, col: (detail?.masterViewController!.notesF)!, value: textView.text)
        
    }

    func textView(_ textView: UITextView, shouldChangeTextIn range: NSRange, replacementText text: String) -> Bool {
        if text == "\n"{
            textView.endEditing(true)
            return false
        }else{
            return true
        }
    }
}
